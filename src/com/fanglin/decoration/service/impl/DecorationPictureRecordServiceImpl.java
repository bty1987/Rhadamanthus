package com.fanglin.decoration.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.dao.DecorationPictureRecordDao;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.decoration.po.DecorationPictureRecordPO;
import com.fanglin.decoration.service.DecorationPictureRecordService;
import com.fanglin.decoration.vo.DecorationPictureVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Service("decorationPictureRecordService")
@Transactional(readOnly = true)
public class DecorationPictureRecordServiceImpl implements DecorationPictureRecordService {

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationPictureDao decorationPictureDao;

	@Autowired
	private DecorationPictureRecordDao decorationPictureRecordDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String downloadDecorationPicture(DecorationPictureVO decorationPicture, String userId) throws FLException {

		UserPO operator = userDao.queryUserByUserId(userId);

		DecorationPicturePO DecorationPicturePO = decorationPictureDao.get(decorationPicture.getDpId());
		DecorationPictureRecordPO decorationPictureRecordPO = new DecorationPictureRecordPO();

		decorationPictureRecordPO.setDpid(DecorationPicturePO.getDpId());
		decorationPictureRecordPO.setOuid(operator.getUid());
		decorationPictureRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationPictureRecordDao.save(decorationPictureRecordPO);

		String path = DecorationPicturePO.getPath();

		return path;
	}

}
