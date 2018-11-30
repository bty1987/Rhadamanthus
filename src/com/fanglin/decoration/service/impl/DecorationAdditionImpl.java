package com.fanglin.decoration.service.impl;

import java.util.HashMap;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
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
	public Map<String, Object> queryDecorationConfig(DecorationVO decorationVO, int company) {
		
		Map<String, Object> config = new HashMap<String, Object>();
		
		String machingType="";
		
		if(decorationVO == null){
			
			SystemConfigPO fullsub = systemConfigDao.querySystemConfig( DecorationPO.TYPE_FULLSUB_STRING, company);
			SystemConfigPO halfprice = systemConfigDao.querySystemConfig( DecorationPO.TYPE_HALFPRICE_STRING, company);
			
			JSONArray fullsubVal = null;
			JSONArray halfpriceVal = null;
			JSONArray _all = new JSONArray();
			
			if (halfprice !=null){
				halfpriceVal = JSONArray.parseArray(halfprice.getValue());
				_all.addAll(halfpriceVal);
			}
			
			if(fullsub != null){
				fullsubVal = JSONArray.parseArray(fullsub.getValue());
				_all.addAll(fullsubVal);
			}
			
			machingType = _all.toJSONString();
		
		}else{
			if(decorationVO.getType() != null){
				
				SystemConfigPO configPO = systemConfigDao.querySystemConfig((decorationVO.getType()== 3 ? DecorationPO.TYPE_FULLSUB_STRING : DecorationPO.TYPE_HALFPRICE_STRING), company);
				
				if(configPO !=null){
					machingType = configPO.getValue();
				}
			}
		} 
		
		config.put("machingType", JSON.parseArray(machingType == "" ? "[]" : machingType));
		
		return config;
	}
	
}
