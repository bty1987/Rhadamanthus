package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EcityDao;
import com.fanglin.market.po.EcityPO;
import com.fanglin.market.service.EcityService;
import com.fanglin.market.vo.EcityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("ecityService")
@Transactional(readOnly = true)
public class EcityServiceImpl implements EcityService{

	@Autowired
	private EcityDao ecityDao;

	@Override
	public void pageEcity(Paging paging, List<Filter> filters) {
		
		List<EcityPO> ecityPOs = ecityDao.pageEcity(paging, filters);
	    List<EcityVO> ecityVOs = new ArrayList<EcityVO>();
	    
	    EcityVO ecityVO;

	    for (EcityPO ecityPO : ecityPOs) {
	    	
	    	ecityVO = new EcityVO();
	    	
	    	BeanUtil.copyPropertie(ecityPO, ecityVO);
	    	
	    	ecityVOs.add(ecityVO);
	    }

	    paging.setData(ecityVOs);
		
	}
	
	@Override
	public List<EcityVO> queryEcity() {
		
		List<EcityPO> ecityPOs = ecityDao.queryEcity();
		List<EcityVO> ecityVOs = new ArrayList<EcityVO>();
		
		EcityVO ecityVO;
		
		for (EcityPO ecityPO : ecityPOs) {
	    	
			ecityVO = new EcityVO();
	    	
	    	BeanUtil.copyPropertie(ecityPO, ecityVO);
	    	
	    	ecityVOs.add(ecityVO);
	    }
		
		return ecityVOs;
		
	}
	
	@Override
	public EcityVO queryEcityByXandY(EcityVO ecity) {
		
		Double x = ecity.getX();
		Double y = ecity.getY();
		
		Double addX = x + 0.5;
		Double subX = x - 0.5;
		
		Double addY = y + 0.5;
		Double subY = y - 0.5;
		
		EcityPO ecityPO = null;
				
		ecityPO = ecityDao.queryEcityByXandY(addX, subX, addY, subY);
		
		if(ecityPO == null){
			ecityPO = ecityDao.queryEcityByCityString("沈阳");
		}
		
		EcityVO ecityVO = new EcityVO();
		
		BeanUtil.copyPropertie(ecityPO, ecityVO);
		
		return ecityVO;
		
	}

	@Override
	public List<EcityVO> queryEcityByPinYin(EcityVO ecity) {
		
		List<EcityPO> ecityPOs = ecityDao.queryEcityByPinYin(ecity.getPinyin());
		List<EcityVO> ecityVOs = new ArrayList<EcityVO>();
		
		EcityVO ecityVO;
		
		for (EcityPO ecityPO : ecityPOs) {
	    	
	    	ecityVO = new EcityVO();
	    	
	    	BeanUtil.copyPropertie(ecityPO, ecityVO);
	    	
	    	ecityVOs.add(ecityVO);
	    }
		
		return ecityVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addEcity(EcityVO ecityVO) {

		EcityPO ecityPO = new EcityPO();
		
		BeanUtil.copyProperties(ecityVO, ecityPO, Arrays.asList("pinyin"));
		
		List<String> pinyins = PinYin4Util.getPinyin(ecityVO.getCity());
	    
		ecityPO.setPinyin((String)pinyins.get(0));
		
		ecityDao.save(ecityPO);
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateEcity(EcityVO ecityVO) {

		EcityPO ecityPO = ecityDao.get(ecityVO.getEcid());
		
		if (ecityPO == null) return;
		
		BeanUtil.copyProperties(ecityVO, ecityPO, Arrays.asList("pinyin"));
		
		List<String> pinyins = PinYin4Util.getPinyin(ecityVO.getCity());
	    
		ecityPO.setPinyin((String)pinyins.get(0));
		
		ecityDao.update(ecityPO);
		
	}

}
