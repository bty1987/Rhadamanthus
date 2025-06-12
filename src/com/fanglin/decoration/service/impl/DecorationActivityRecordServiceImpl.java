package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationActivityRecordDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityRecordPO;
import com.fanglin.decoration.service.DecorationActivityRecordService;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationActivityRecordVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;

@Service("decorationActivityRecordService")
@Transactional(readOnly = true)
public class DecorationActivityRecordServiceImpl implements DecorationActivityRecordService {

	@Autowired
	private DecorationActivityRecordDao decorationActivityRecordDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DecorationActivityRecordVO> queryDecorationActivityRecord(DecorationActivityRecordVO decorationActivityRecordVO) throws FLException {

		List<DecorationActivityRecordPO> decorationActivityRecordPOs = decorationActivityRecordDao.queryDecorationActivityRecord(decorationActivityRecordVO.getDecorationActivityItem().getDaiId());
		List<DecorationActivityRecordVO> decorationActivityRecordVOs = new ArrayList<DecorationActivityRecordVO>();

		for (DecorationActivityRecordPO decorationActivityRecordPO : decorationActivityRecordPOs) {
			decorationActivityRecordVOs.add(decorationActivityRecordPO.ptv(new DecorationActivityRecordVO(new DecorationActivityItemVO(), new UserBaseVO())));
		}

		return decorationActivityRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationActivityRecord(DecorationActivityRecordVO decorationActivityRecordVO, String userId) throws FLException {

		DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityRecordVO.getDecorationActivityItem().getDaiId());

		if (decorationActivityItemPO == null) {
			throw new FLException(140030, "装修活动物品不存在");
		}

		DecorationActivityRecordPO decorationActivityRecordPO = new DecorationActivityRecordPO();

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationActivityRecordPO.init(decorationActivityRecordVO.getDaid(), decorationActivityItemPO, DecorationActivityItemPO.STATUS_PURCHER_INT, operater, decorationActivityRecordVO.getComment());

		decorationActivityRecordDao.save(decorationActivityRecordPO);

		return 0;
	}
}
