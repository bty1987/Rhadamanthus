package com.fanglin.decoration.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("decorationAdditionService")
@Transactional(readOnly=true)
public class DecorationAdditionImpl implements DecorationAdditionService{

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Override
	public DecorationAdditionVO queryDecorationAdditionByOrderId(DecorationAdditionVO decorationAdditionVO) {
		
		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(decorationAdditionVO.getOrderId());
		decorationAdditionVO = new DecorationAdditionVO();

		BeanUtil.copyProperties(decorationAdditionPO, decorationAdditionVO);
		
		return decorationAdditionVO;
	}

	@Override
	public Map<String, Object> queryDecorationConfig(int company) {
		
		Map<String, Object> config = new HashMap<String, Object>();
		
		SystemConfigPO machingType = systemConfigDao.querySystemConfig("decorationMachingType", company);
		
		config.put("machingType", JSON.parseArray(machingType == null ? "[]" : machingType.getValue()));
		
		return config;
	}

}
