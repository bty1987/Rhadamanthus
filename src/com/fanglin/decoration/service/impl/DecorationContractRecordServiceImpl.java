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

}
