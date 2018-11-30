package com.fanglin.market.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.dao.EpersonDao;
import com.fanglin.market.po.EpersonPO;
import com.fanglin.market.service.EpersonService;
import com.fanglin.market.vo.EpersonVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PinYin4Util;

@Service("epersonService")
@Transactional(readOnly = true)
public class EpersonServiceImpl implements EpersonService{

	@Autowired
	private EpersonDao epersonDao;
	
	@Override
	public void pageEperson(Paging paging, List<Filter> filters) {
		
		List<EpersonPO> EpersonPOs = epersonDao.pageEperson(paging, filters);
		List<EpersonVO> EpersonVOs = new ArrayList<EpersonVO>();
		
		for (EpersonPO epersonPO : EpersonPOs) {
			
			EpersonVO epersonVO = new EpersonVO();
			
			BeanUtil.copyProperties(epersonPO, epersonVO);
			
			EpersonVOs.add(epersonVO);
		}
		
		paging.setData(EpersonVOs);
		
	}

	@Override
	public EpersonVO queryEpersonByEuid(EpersonVO person) {
		
		EpersonPO epersonPO = epersonDao.queryEpersonByEuid(person.getEuid());
		EpersonVO epersonVO = new EpersonVO();
		
		BeanUtil.copyProperties(epersonPO, epersonVO);
		
		return epersonVO;
	}
	
	@Override
	public List<EpersonVO> queryEpersonByPinYin(EpersonVO person) {
		
		List<EpersonPO> EpersonPOs = epersonDao.queryEpersonByPinYin(person.getPinyin());
		List<EpersonVO> EpersonVOs = new ArrayList<EpersonVO>();
		
		for (EpersonPO epersonPO : EpersonPOs) {
			
			EpersonVO epersonVO = new EpersonVO();
			
			BeanUtil.copyProperties(epersonPO, epersonVO);
			
			EpersonVOs.add(epersonVO);
		}
		
		return EpersonVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addEperson(EpersonVO personVO) {
		
		EpersonPO epersonPO = new EpersonPO();
		
		BeanUtil.copyProperties(personVO, epersonPO, Arrays.asList("pinyin"));
		
		List<String> pinyins = PinYin4Util.getPinyin(personVO.getName());
	    
		epersonPO.setPinyin((String)pinyins.get(0));
		
		epersonDao.save(epersonPO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateEperson(EpersonVO personVO) throws FLException {

		EpersonPO personPO = epersonDao.get(personVO.getEuid());
		
		if(personPO == null) {
			throw new FLException(340009, "用户不存在");
		}
		
		BeanUtil.copyProperties(personVO, personPO, Arrays.asList("pinyin"));
		
		List<String> pinyins = PinYin4Util.getPinyin(personVO.getName());
	    
		personPO.setPinyin((String)pinyins.get(0));
		
		epersonDao.update(personPO);
		
	}
	
}
