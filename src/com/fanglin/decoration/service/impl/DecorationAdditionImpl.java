package com.fanglin.decoration.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
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
		
		List<Short> types = Arrays.asList(DecorationPO.TYPE_HOLONOMY_INT, DecorationPO.TYPE_FULLSUB_INT, DecorationPO.TYPE_DOUSUB_INT);
		
		JSONArray holonomyConfigs = new JSONArray();
		
		if(decorationVO != null && decorationVO.getType() != null){
			SystemConfigPO _config = systemConfigDao.querySystemConfig(String.format(DecorationPO.CONFIG_KEY_HOLONOMY_STR, decorationVO.getType()), company);
			holonomyConfigs.addAll(JSONArray.parseArray(_config == null ? "[]" : _config.value("[]")));
		}else{
			for(Short type: types){
				SystemConfigPO _config = systemConfigDao.querySystemConfig(String.format(DecorationPO.CONFIG_KEY_HOLONOMY_STR, type), company);
				holonomyConfigs.addAll(JSONArray.parseArray(_config == null ? "[]" : _config.value("[]")));
			}
		}

		config.put("machingType", holonomyConfigs);

		return config;
	}
	
}
