import { Avatar, Card, Button, Paper, TextField } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { ChangeEvent, useEffect, useState } from 'react';
import api from '../../libs/api';
import { useNotification } from '../../notification-context';
import { getFirstLetter, CapFirstLetter } from '../../libs/utils';
import { EditLabelList, InfoData, InfoLabel } from './type';

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
  const editLabelList: EditLabelList[] = [
    {
      label: 'name',
      required: true,
      isError: false,
      helperText: '',
      rule: () => {
        return true;
      },
    },
    { label: 'phone', required: false, isError: false, helperText: '', rule: null },
    { label: 'email', required: false, isError: false, helperText: '', rule: null },
  ];

  async function getProfileData() {
    const { data } = await api.get('/api/profileData');
    setInfoData(data.data);
  }

  const editProfileData = async (data: InfoData) => {
    const res = await api.post('/api/editProfileData', data);
    if (res.data.success) {
      showNotification('成功', 'success');
    }
  };

  const editClick = async () => {
    if (isEdit) {
      // 保存
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

  return (
    <div className="pt-5 flex justify-center">
      <Paper elevation={3} className="w-[400px] h-[650px] flex flex-col items-center p-3">
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
                  className="w-full  !mt-3"
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
                <div>{infoData.name}</div>
              </div>
            </div>
            <Card className="w-full bg-[linear-gradient(145deg,_#73dafc,_#c87efe)] py-5 !text-white">
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
