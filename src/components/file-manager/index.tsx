import { Table as AntDTable, Button, Checkbox, Tooltip } from "antd";
import { faCircleCheck, faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import axiosInstance from "../../api";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

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

const useFiles = () => {
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = useCallback(async (e: any) => {
    const data = await readFileList(e.target.files);
    setFiles(data);
  }, []);

  return [
    files,
    setFiles,
    handleUpload
  ] as any;
}

const retrieve = async (path: string = "") => {
  const response = await axiosInstance.get("/file-manager", { params: { path } });
  return response.data;
}

const upload = async (file: any) => {
  const response = await axiosInstance.post("/file-manager/upload", file);
  return response.data;
}

const allowUncompress = (file: any) => {
  return file.filename.slice(-4) === ".zip";
}

const FileManager = () => {
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const [files, setFiles, uploadFiles] = useFiles();
  const [listing, setListing] = useState<any[]>([]);
  console.log(35, files);
  console.log(57, listing);

  const handleRetrieve = useCallback(async (path: string = "") => {
    const data = await retrieve(path);
    setListing(data.list);
  }, []);

  useEffect(() => {
    handleRetrieve(currentFolder);
  }, [files, currentFolder]);

  const handleUpload = useCallback((file: any) => () => {
    const data = upload(file);
    console.log(53, data);
  }, []);

  const handleUploadAll = useCallback(async () => {
    const newFiles = await Promise.all(files.map(async (file: any) => {
      const data = await upload(file);
      return {
        ...file,
        uploaded: true
      };
    }));
    setFiles(newFiles);
  }, [files]);

  const handleToggleZip = useCallback((fileIndex: number) => () => {
    setFiles((arr: any[]) => {
      arr[fileIndex].uncompress = !arr[fileIndex].uncompress;
      return [ ...arr ];
    });
  }, []);

  const handlePushDirectoryName = useCallback((path: string) => {
    setCurrentFolder(current => `${current}/${path}`);
  }, []);

  const handlePopDirectoryName = useCallback(() => {
    setCurrentFolder(current => current.split("/").slice(0, -1).join("/"));
  }, []);

  const handleToggleCheck = useCallback((index: number) => () => {
    setListing(list => {
      list[index].checked = !list[index].checked;
      return [ ...list ];
    });
  }, []);

  // to-do
  const handleDelete = useCallback((filename: string) => () => {

  }, []);

  // to-do
  const handleRename = useCallback((filename: string) => () => {

  }, []);

  // to-do: one checkbox selected activates "edit mode" on table,
  // so user can select row by clicking in any part of row

  return (
    <div>
      <div>file manager</div>
      <Upload className="btn btn-primary"> 
        Select files
        <input type="file" onChange={uploadFiles} multiple/>
      </Upload>
      <Table className="m-3" rowKey="filename" dataSource={files} pagination={false}
        columns={[
          {
            title: "Filename",
            dataIndex: "filename",
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
            render: (_, file: any, fileIndex) => {
              return <Checkbox disabled={!allowUncompress(file)} className="ms-1"
                checked={!!file?.uncompress} onChange={handleToggleZip(fileIndex)} />
            }
          },
          {
            title: "Uploaded",
            dataIndex: "uploaded",
            render: uploaded => 
              <FAIcon uploaded={uploaded} icon={uploaded ? faCircleCheck : faXmark} />
          }
        ]}
        footer={() => 
          (
            <Button onClick={handleUploadAll}>
              Start uploading
            </Button>
          )
        }
      />      

      <Table className="m-3" rowKey="filename" pagination={false}
        dataSource={[ ...listing, ...( currentFolder === "" ? [] : [{ filename: ".."}] ) ]}  
        columns={[
          {
            dataIndex: "checked",
            render: (checked, __, index) => {
              return index === listing.length ? null :
              <Checkbox checked={checked} onChange={handleToggleCheck(index)} />
            }
          },
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
          {
            title: "actions",
            render: (_, file: any) => {
              return  file.filename === ".." ? null
              : <>
                  <Tooltip title="delete">
                    <FAIconClickable icon={faTrashCan} onClick={handleDelete(file.filename)} />
                  </Tooltip>
                  <Tooltip title="rename">
                    <FAIconClickable className="ms-2" onClick={handleRename(file.filename)} icon={faPencil} />
                  </Tooltip>
                </>;
            }
          }
        ]}
      />
    </div>
  )
}

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