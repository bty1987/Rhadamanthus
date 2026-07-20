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
import com.fanglin.log.service.DecorationPictureLogService;
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

	@Autowired
	private DecorationPictureLogService decorationPictureLogService;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String downloadDecorationPicture(DecorationPictureVO decorationPicture, String userId) throws FLException {

		UserPO operator = userDao.queryUserByUserId(userId);

		DecorationPicturePO DecorationPicturePO = decorationPictureDao.get(decorationPicture.getDpId());

		// Phase 7: 补防御 NPE（原代码 DecorationPicturePO 为 null 时会 NPE）
		if (DecorationPicturePO == null){
			throw new FLException(220003, "图纸不存在");
		}

		DecorationPictureRecordPO decorationPictureRecordPO = new DecorationPictureRecordPO();

		decorationPictureRecordPO.setDpid(DecorationPicturePO.getDpId());
		decorationPictureRecordPO.setOuid(operator.getUid());
		decorationPictureRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		decorationPictureRecordDao.save(decorationPictureRecordPO);

		// Phase 7: 同时写入 log 模块的统一图纸下载日志表（双写过渡期）
		decorationPictureLogService.addDecorationPictureLog(DecorationPicturePO.getDpId(), DecorationPicturePO.getOrderId(), userId);

		String path = DecorationPicturePO.getPath();

		return path;
	}

}

