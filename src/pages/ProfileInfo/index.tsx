import { Avatar, Card, Button, Paper, TextField } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { ChangeEvent, useEffect, useState } from 'react';
import api from '../../libs/api';
import { useNotification } from '../../notification-context';
import { getFirstLetter, CapFirstLetter, isFieldEmpty } from '../../libs/utils';
import { EditLabelList, InfoData, InfoLabel } from './type';
import bg from '../../assets/bg.png';

const infoItem = (item: InfoLabel, infoData: InfoData) => {
  return (
    <div key={item.label} className="flex items-center">
      <div className="w-[15%] text-center">{item.icon}</div>
      <div>
        <div>{CapFirstLetter(item.label)}</div>
        <div>{infoData[item.label] || '-'}</div>
      </div>
    </div>
  );
};

function ProfileInfo() {
  const { showNotification } = useNotification();

  const [isEdit, setIsEdit] = useState(false);
  const [infoData, setInfoData] = useState<InfoData>({});
  // 展示用的label
  const infoLabelList: InfoLabel[] = [
    {
      label: 'phone',
      icon: <CallIcon />,
    },
    {
      label: 'email',
      icon: <EmailIcon />,
    },
  ];

  // 编辑用的label
  const [editLabelList, setEditLabelList] = useState<EditLabelList[]>([
    {
      label: 'name',
      required: true,
      isError: false,
      helperText: '',
      rule: null,
    },
    {
      label: 'phone',
      required: false,
      isError: false,
      helperText: '',
      rule: (value?: any): boolean => {
        if (!value) return true;
        const regex = /^\d+$/;
        return regex.test(value);
      },
    },
    {
      label: 'email',
      required: false,
      isError: false,
      helperText: '',
      rule: (value?: any): boolean => {
        if (!value) return true;
        const regex = /@/;
        return regex.test(value);
      },
    },
  ]);

  async function getProfileData() {
    const { data } = await api.get('/api/profileData');
    setInfoData(data);
  }

  const editProfileData = async (data: InfoData) => {
    const res = (await api.post('/api/editProfileData', data)) as { success: boolean };
    if (res.success) {
      showNotification('成功', 'success');
    }
  };

  // 表单校验,返回true通过,false不通过
  const formCheck = () => {
    let isValid = true;
    const updatedLabelList = editLabelList.map((item) => {
      if (item.required && isFieldEmpty(infoData[item.label])) {
        // 必填校验
        item.isError = true;
        item.helperText = `${CapFirstLetter(item.label)} is required`;
        isValid = false;
      } else if (item.rule && !item.rule(infoData[item.label])) {
        // 规则校验
        item.isError = true;
        item.helperText = `${CapFirstLetter(item.label)} is error`;
        isValid = false;
      } else {
        item.isError = false;
        item.helperText = '';
      }
      return item;
    });
    setEditLabelList(updatedLabelList);
    return isValid;
  };

  const editClick = async () => {
    if (isEdit) {
      // 保存--校验数据
      if (!formCheck()) return;
      await editProfileData(infoData);
    }
    setIsEdit(!isEdit);
  };

  const textChange = (e: ChangeEvent<HTMLInputElement>, item: EditLabelList) => {
    setInfoData({
      ...infoData,
      [item.label]: e.target.value,
    });
  };

  useEffect(() => {
    // 获取数据
    getProfileData();
  }, []);

  const backgroundImageStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="pt-0 md:pt-5 h-full flex justify-center ">
      <Paper
        elevation={3}
        style={backgroundImageStyle}
        className="w-full md:w-[400px] h-full md:h-[650px] flex flex-col items-center p-3">
        <div className="w-full text-right">
          <Button onClick={editClick}>
            {isEdit ? <SaveIcon className="text-[#00000042]" /> : <EditIcon className="text-[#00000042]" />}
          </Button>
        </div>
        {isEdit ? (
          // 编辑
          <div className="w-full h-full pt-10">
            {editLabelList.map((item) => {
              return (
                <TextField
                  required={item.required}
                  error={item.isError}
                  key={item.label}
                  label={CapFirstLetter(item.label)}
                  variant="outlined"
                  size="small"
                  value={infoData[item.label]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    textChange(e, item);
                  }}
                  helperText={item.helperText}
                  className="w-full !mt-3"
                />
              );
            })}
          </div>
        ) : (
          // 展示
          <div className="w-full h-full">
            <div className="h-[40%] w-full flex items-center">
              <div className="w-full flex flex-col justify-between items-center">
                <Avatar className="!w-[100px] !h-[100px]" variant="rounded">
                  {infoData.name ? getFirstLetter(infoData.name) : '-'}
                </Avatar>
                <div className="!text-white">{infoData.name}</div>
              </div>
            </div>
            <Card className="w-full bg-[linear-gradient(145deg,_#e5b7b7,_#6bb392)] py-5 !text-white">
              {infoLabelList.map((item) => {
                return infoItem(item, infoData);
              })}
            </Card>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default ProfileInfo;
