package com.fanglin.decoration.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.service.DecorationInfoService;


@Service("decorationInfoService")
@Transactional(readOnly = true)
public class DecorationInfoServiceImpl implements DecorationInfoService {

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Override
	public DecorationInfoPO queryDecorationInfoByOrderId(String orderId) {

		DecorationInfoPO decorationInfo = decorationInfoDao.queryDecorationInfoByOrderId(orderId);

		if (decorationInfo == null) {
			decorationInfo = new DecorationInfoPO();
		}

		return decorationInfo;
	}

}
