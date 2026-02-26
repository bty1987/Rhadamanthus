package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.DecorationContractRecordDao;
import com.fanglin.decoration.po.DecorationContractRecordPO;
import com.fanglin.decoration.service.DecorationContractRecordService;
import com.fanglin.decoration.vo.DecorationContractRecordVO;

@Service("decorationContractRecordService")
@Transactional(readOnly = true)
public class DecorationContractRecordServiceImpl implements DecorationContractRecordService {

	@Autowired
	private DecorationContractRecordDao decorationContractRecordDao;

	@Override
	public List<DecorationContractRecordVO> queryDecorationContractRecord(String orderId) {
		List<DecorationContractRecordPO> decorationContractRecordPOs = decorationContractRecordDao.queryDecorationContractRecord(orderId);
		List<DecorationContractRecordVO> decorationContractRecordVOs = new ArrayList<DecorationContractRecordVO>();

		for (DecorationContractRecordPO decorationContractRecordPO : decorationContractRecordPOs) {
			decorationContractRecordVOs.add(decorationContractRecordPO.ptv(new DecorationContractRecordVO()));
		}

		return decorationContractRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationContract(DecorationContractRecordVO decorationContractRecordVO) {
		// 根据orderId查询是否存在记录
		DecorationContractRecordPO existingRecord = decorationContractRecordDao.querySingleDecorationContractRecord(decorationContractRecordVO.getOrderId());

		if (existingRecord != null) {
			// 存在则更新
			existingRecord.setCommitTime(decorationContractRecordVO.getCommitTime());
			existingRecord.setStartTime(decorationContractRecordVO.getStartTime());
			existingRecord.setEndTime(decorationContractRecordVO.getEndTime());
			existingRecord.setComment(decorationContractRecordVO.getComment());
			decorationContractRecordDao.saveOrUpdate(existingRecord);
		} else {
			// 不存在则创建
			DecorationContractRecordPO newRecord = new DecorationContractRecordPO();
			newRecord.setOrderId(decorationContractRecordVO.getOrderId());
			newRecord.setCommitTime(decorationContractRecordVO.getCommitTime());
			newRecord.setStartTime(decorationContractRecordVO.getStartTime());
			newRecord.setEndTime(decorationContractRecordVO.getEndTime());
			newRecord.setComment(decorationContractRecordVO.getComment());
			decorationContractRecordDao.save(newRecord);
		}
	}

}
