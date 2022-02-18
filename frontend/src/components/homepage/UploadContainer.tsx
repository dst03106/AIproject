import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const UploadContainer = () => {
  //드래그 중일때와 아닐 때의 스타일을 구분하기 위한 state 변수
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  // 드래그 이벤트를 감지한 ref 참조변수 (label 태그에 들어갈 예정)
  const dragRef = useRef<HTMLLabelElement | null>(null);

  const onClickFiles = useCallback(
    (e: React.TouchEvent<HTMLButtonElement> | any): void => {
      console.log('클릭 댐');

      let selectFiles: File[] = [];

      selectFiles = e.target.files;

      preview(selectFiles);
      setFiles(selectFiles);
    },
    [files],
  );

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | any): void => {
      let selectFiles: File[] = [];
      // let tempFiles: IFileTypes[] = files;

      console.log(isDragging);

      if (e.type === 'drop') {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }
      preview(selectFiles);
      setFiles(selectFiles);
    },
    [files],
  );

  const preview = (select: any) => {
    const imgEl: any = document.querySelector('.dragContainer');

    const reader = new FileReader();

    console.log(select);

    reader.onloadend = () => {
      if (select.length > 0) {
        imgEl.style.backgroundImage = `url(${reader.result})`;
      }
    };
    if (select === null) {
      imgEl.style.backgroundImage = `url()`;
    }

    reader.readAsDataURL(select !== null ? select[0] : null);
  };

  const handleFilterFile = useCallback((): void => {
    setFiles([]);
    preview(null);
  }, [files]);

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles],
  );

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn);
      dragRef.current.addEventListener('dragleave', handleDragOut);
      dragRef.current.addEventListener('dragover', handleDragOver);
      dragRef.current.addEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn);
      dragRef.current.removeEventListener('dragleave', handleDragOut);
      dragRef.current.removeEventListener('dragover', handleDragOver);
      dragRef.current.removeEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <div className="flex ">
      <div
        className="upload-container"
        style={{
          background: `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url(/img/dog.jpg)`,
          backgroundSize: 'cover',
        }}
      >
        <div
          className="upload-div"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-3/5 py-2 h-2/5 hidden sm:block md:h-80 lg:h-96">
              <input
                type="file"
                id="fileUpload"
                style={{ display: 'none' }}
                multiple={true}
                onChange={onChangeFiles}
              />
              <label htmlFor="fileUpload" ref={dragRef}>
                <div
                  className={`drop-container dragContainer   ${
                    isDragging ? `bg-slate-200` : 'bg-gray-50'
                  }`}
                >
                  <span
                    className={` hidden md:block ${
                      files.length === 0 ? `visible` : `invisible`
                    } font-bold mb-5`}
                  >
                    Drag & Drop <br />
                    <br />
                    파일 선택
                  </span>
                  <img
                    className={`w-20 h-20 ${
                      isDragging ? `animate-fade-in-up` : `null`
                    }`}
                    src="./img/upload.png"
                    alt="업로드 이미지"
                  />
                </div>
              </label>
            </div>
            <span className="py-3 text-xs font-bold text-white">
              파일명 : &nbsp;
              {files.length > 0 && (
                <span>
                  <span>{files[0]?.name}</span>
                  <span
                    className="cursor-pointer drags hover:text-rose-500"
                    onClick={() => handleFilterFile()}
                  >
                    &nbsp; X
                  </span>
                </span>
              )}
            </span>
            <p className="upload-text 2xl:text-2xl 2xl:block lg:text-1xl lg:blok">
              어떤 식물인지 궁금하다면 푸르댕댕에 맡겨주세요!
            </p>

            <div className="upload-btnContainer md:flex-row">
              <button className="upload-btn " onClick={() => onClickFiles}>
                이미지 등록
              </button>
              <button className="upload-btn ">식물 검사</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadContainer;