package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.PriceDao;
import com.fanglin.inventory.po.PricePO;
import com.fanglin.inventory.service.PriceService;
import com.fanglin.inventory.vo.PriceVO;
import com.fanglin.utils.BeanUtil;
@Service("priceService")
@Transactional(readOnly=true)
public class PriceServiceImpl implements PriceService{
	
	@Autowired
	private PriceDao priceDao;
	
	@Override
	public List<PriceVO> queryPriceByGid(PriceVO priceVO) {
		
		List<PricePO> pricePOs = priceDao.queryPriceByGid(priceVO.getGid());
		List<PriceVO> priceVOs = new ArrayList<PriceVO>();
		
		for(PricePO pricePO: pricePOs){
			
			priceVO = new PriceVO();

			String content = pricePO.getSelling() +" "+ pricePO.getName();
			
			BeanUtil.copyProperties(pricePO, priceVO);
			priceVO.setContent(content);
			
			priceVOs.add(priceVO);
		}
		
		return priceVOs;
	}

	@Override
	public PriceVO queryPriceByPid(PriceVO priceVO) {
		
		PricePO pricePO = priceDao.queryPriceByPid(priceVO.getPid());
		
		PriceVO priceVOs = new PriceVO();
		BeanUtil.copyProperties(pricePO, priceVOs);
		
		return priceVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addPrice(PriceVO priceVO) throws FLException {
		
		PricePO pricePO = new PricePO();
		
		BeanUtil.copyProperties(priceVO, pricePO);
		
		priceDao.save(pricePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deletePrice(PriceVO priceVO) throws FLException {
		
		PricePO pricePO = priceDao.get(priceVO.getPid());
		
		if(pricePO == null){
			throw new FLException(260016, "价格不存在");
		}
		
		priceDao.delete(pricePO);
		
		return 0;
	}
	
}
