import { Table as AntDTable, Button, Checkbox, Form, Input, Modal, Tooltip } from "antd";
import { faCircleCheck, faDownload, faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";

import axiosInstance from "../../api";
import { useEffectAsync } from "../../utils";


const readFileList = (files: FileList): Promise<string[]> => {
  return new Promise(resolve => {
    const urls: any[] = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        urls.push({
          contents: reader.result as string,
          lastModified: new Date(file.lastModified),
          filename: file.name,
          size: file.size,
          type: file.type
        });
        if (urls.length === files.length) {
          resolve(urls);
        }
      }
      reader.readAsDataURL(file);
    }
  })
}

const retrieve = async (path: string = "") => {
  const response = await axiosInstance.get("/file-manager", { params: { path } });
  return response.data;
}

const upload = async (file: any) => {
  const response = await axiosInstance.post("/file-manager", file);
  return response.data;
}

const remove = async (path: string) => {
  const response = await axiosInstance.delete("/file-manager", { params: { path } });
  return response.data;
}

const allowUncompress = (file: any) => {
  return file.filename.slice(-4) === ".zip";
}

const rename = async (oldName: string, newName: string) => {
  const response = await axiosInstance.patch("/file-manager", { oldName, newName });
  return response.data;
}


const FileManager = () => {
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const [uploaded, setUploaded] = useState<boolean[]>([]);
  const [listing, setListing] = useState<any[]>([]);
  const [openRenameModal, setOpenRenameModal] = useState<number>(-1);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      file: [] as any[]
    }
  });
  const { fields: files, remove: removeFromUploadList } = useFieldArray({
    control,
    name: "file",
  });

  const { handleSubmit: handleRenameSubmit, control: renameControl, setValue: setRenameValue } = useForm({
    defaultValues: {
      filename: "",
    }
  });

  useEffect(() => {
    if (openRenameModal !== -1) {
      setRenameValue("filename", listing[openRenameModal].filename);
    }
  }, [openRenameModal]);
  

  const uploadFiles = useCallback(async (e: any) => {
    const data = await readFileList(e.target.files);
    setValue("file", data);
  }, []);

  const isListingEdited = useMemo(() => {
    return listing.some(file => file.checked);
  }, [listing]);

  useEffectAsync(async () => {
    const data = await retrieve(currentFolder);
    setListing(data.list);
  }, [uploaded, currentFolder]);
  
  const handleUploadAll = useCallback((values: any) => {
    const currentFiles: any[] = values.file;
    currentFiles.forEach(async (file: any, index: number) => {
      await upload(file);
      setUploaded(ups => {
        if (ups.length === currentFiles.length) {
          ups[index] = true;
          return [ ...ups ];
        } else {
          return currentFiles.map((_, cfIndex) => {
            return cfIndex === index;
          });
        }
      });
      setValue(`file.${index}.uploaded`, true);
    });
  }, []);

  const handlePushDirectoryName = useCallback((path: string) => {
    setCurrentFolder(current => `${current}/${path}`);
  }, []);

  const handlePopDirectoryName = useCallback(() => {
    setCurrentFolder(current => current.split("/").slice(0, -1).join("/"));
  }, []);

  const handleToggleCheck = useCallback((index: number) => () => {
    if (isListingEdited) {
      setListing(list => {
        list[index].checked = !list[index].checked;
        return [ ...list ];
      });
    }
  }, [isListingEdited]);

  const handleDelete = useCallback((filename: string) => async () => {
    await remove(`${currentFolder}/${filename}`);
    setListing(list => {
      return list.filter(file => file.filename !== filename);
    });
  }, [currentFolder]);

  const onSelectChange = useCallback((filenames: React.Key[]) => {
    setListing(list => {
      return list.map(file => {
        return {
          ...file,
          checked: filenames.includes(file.filename)
        }
      });
    })
  }, []);

  const rowSelection = useMemo(() => ({
    selectedRowKeys: listing.filter(file => file.checked).map(file => file.filename),
    onChange: onSelectChange,
  }), [listing]);

  const handleDeleteChecked = useCallback(() => {
    listing.filter(file => file.checked).forEach(file => {
      handleDelete(file.filename)();
    });
  }, [listing]);

  const listingJSX = useMemo(() => {
    return (
      <>
        <Tooltip title="delete">
          <FAIconClickable icon={faTrashCan} onClick={handleDeleteChecked} />
        </Tooltip>
      </>
    );
  }, [listing]);

  const handleUploadRemove = useCallback((index: number) => () => {
    removeFromUploadList(index);
  }, []);

  const handleRename = useCallback(async (values: any) => {
    const { filename } = listing[openRenameModal];
    await rename(`${currentFolder}/${filename}`, `${currentFolder}/${values.filename}`);
    setOpenRenameModal(-1);
  }, [openRenameModal]);

  return (
    <div>
      <div>file manager</div>
      <Upload className="btn btn-primary"> 
        Select files
        <input type="file" onChange={uploadFiles} multiple/>
      </Upload>
      <Form onFinish={handleSubmit(handleUploadAll)}>
        <Table className="m-3" rowKey="filename" dataSource={files} pagination={false} // to-do: rowSelection
          columns={[
            {
              title: "Filename",
              dataIndex: "filename",
              render: (_, __, index) => {
                return (
                  <Form.Item>
                    <Controller
                      name={`file.${index}.filename`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input {...field} />}
                    />
                  </Form.Item>
                )
              }
            },
            {
              title: "Size(bytes)",
              dataIndex: "size"
            },
            {
              title: "Type",
              dataIndex: "type"
            },
            {
              title: "Uncompress",
              render: (_, file: any, index) => {
                return (
                  <Form.Item>
                    <Controller
                      name={`file.${index}.uncompress`}
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value} disabled={!allowUncompress(file)} />}
                    />
                  </Form.Item>
                );
              }
            },
            {
              title: "Uploaded",
              dataIndex: "uploaded",
              render: (_, __, index) => 
                <FAIcon uploaded={uploaded[index]} icon={uploaded[index] ? faCircleCheck : faXmark} />
            },
            {
              title: "actions",
              render: (_, __, index) => {
                return (
                  <FAIconClickable icon={faTrashCan} onClick={handleUploadRemove(index)}/>
                )
              }
            }
          ]}
          footer={() => 
            (
              <Form.Item>
                {/* <Button htmlType="submit" disabled={rhfFile.length === 0}> */}
                <Button htmlType="submit" disabled={files.length === 0}>
                  Start uploading
                </Button>
              </Form.Item>
            )
          }
        />
      </Form>

      <Table className="m-3" rowKey="filename" pagination={false} rowSelection={rowSelection}
        footer={() => isListingEdited ? listingJSX : null}
        onRow={(_, index: number = 0) => ({
          onClick: handleToggleCheck(index)
        })}
        dataSource={[ ...listing, ...( currentFolder === "" ? [] : [{ filename: ".."}] ) ]} 
        columns={[
          {
            title: "Filename",
            dataIndex: "filename",
            render: (_, file: any) => {
              return file.filename === ".." ?
              (
                <Filename isDirectory={true}
                  onClick={handlePopDirectoryName}>
                  {file.filename}
                </Filename>
              )
              :
              (
                <Filename isDirectory={file.isDirectory}
                  onClick={() => file.isDirectory ? handlePushDirectoryName(file.filename) : null}>
                  {file.filename}
                </Filename>
              );
            }
          },
          ...(isListingEdited ? [] : [{
            title: "actions",
            render: (_: any, file: any, index: number) => {
              return  file.filename === ".." ? null
              : <>
                  <Tooltip title="delete">
                    <FAIconClickable icon={faTrashCan} onClick={handleDelete(file.filename)} />
                  </Tooltip>
                  <Tooltip title="rename">
                    <FAIconClickable className="ms-2" onClick={() => setOpenRenameModal(index)} icon={faPencil} />
                  </Tooltip>
                  {!file.isDirectory && (
                    <Tooltip title="access">
                      <A href={`http://localhost:4000/media${currentFolder}/${file.filename}`} className="ms-2" target="_blank">
                        <FontAwesomeIcon icon={faDownload} />
                      </A>
                    </Tooltip>
                  )}
                </>;
            }
          }])
        ]}
      />

      <Modal open={openRenameModal !== -1} onCancel={() => setOpenRenameModal(-1)}
        onOk={handleRenameSubmit(handleRename)}>
        <Form>
          <Form.Item label="Current name">
            <Input value={openRenameModal === -1 ? "" : listing[openRenameModal].filename} />
          </Form.Item>
          <Form.Item label="New name">
            <Controller
              name="filename"
              control={renameControl}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const A = styled.a`
  color: gray;
`

const Upload = styled.label`
  input {
    display: none;
  }
`

const Filename = styled.span<{
  isDirectory: boolean
}>`
  cursor: ${({ isDirectory }) => isDirectory ? "pointer" : "default"};
  text-decoration: ${({ isDirectory }) => isDirectory ? "underline" : "none"};
`;

const FAIcon = styled(FontAwesomeIcon)<{
  uploaded: boolean
}>`
  color: ${({ uploaded }) => uploaded ? "green" : "gray"};
`

const FAIconClickable = styled(FontAwesomeIcon)`
  font-size: 20px;
  cursor: pointer;
  color: gray;
`;

const Table = styled(AntDTable)`
  table {
    width: auto;
  }
  /* td:nth-child(1) {
    width: 100px;
  }

  td:nth-child(2) {
    width: 50px;
  }

  td:nth-child(3) {
    width: 100px;
  } */
`

export default FileManager;