package com.fanglin.decoration.service.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("decorationAdditionService")
@Transactional(readOnly = true)
public class DecorationAdditionImpl implements DecorationAdditionService {

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
	public Map<String, Object> queryDecorationConfig(DecorationVO decorationVO, int company) {

		Map<String, Object> config = new HashMap<String, Object>();
		
		short type = decorationVO != null && decorationVO.getType() != null ? decorationVO.getType() : -1;

		List<SystemConfigPO> systemConfigs = systemConfigDao.obtainSystemConfig(DecorationPO.CONFIG_KEY_HOLONOMY_STR, company);

		JSONArray holonomyConfigs = new JSONArray();

		for (SystemConfigPO systemConfig : systemConfigs) {
			holonomyConfigs.addAll(JSONArray.parseArray(systemConfig.getValue()));
		}
		
		Iterator<Object> iterator = holonomyConfigs.iterator();
		
		while(iterator.hasNext()){
			JSONObject _config = JSONObject.parseObject(iterator.next().toString());
			
			if(type != -1 && _config.getShortValue("dt") != type) iterator.remove();
		}
		
		config.put("machingType", holonomyConfigs);

		return config;
	}
	
}
