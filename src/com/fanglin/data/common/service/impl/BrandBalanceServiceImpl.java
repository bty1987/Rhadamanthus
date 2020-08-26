package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.BrandBalanceDao;
import com.fanglin.data.common.service.BrandBalanceService;
import com.fanglin.data.common.vo.BrandBalanceVO;
import com.fanglin.data.po.BrandBalancePO;
import com.fanglin.utils.BeanUtil;

@Service("brandBalanceService")
@Transactional(readOnly = true)
public class BrandBalanceServiceImpl implements BrandBalanceService {
	
	@Autowired
	private BrandBalanceDao brandBalanceDao;

	@Override
	public List<BrandBalanceVO> queryBrandBalance(BrandBalanceVO brandBalanceVO) {
		
		List<BrandBalancePO> brandBalancePOs = brandBalanceDao.queryBrandBalance(brandBalanceVO.getBid());
		List<BrandBalanceVO> brandBalanceVOs = new ArrayList<BrandBalanceVO>();
		
		for (BrandBalancePO brandBalancePO : brandBalancePOs) {
			
			brandBalanceVO = new BrandBalanceVO();
			
			BeanUtil.copyProperties(brandBalancePO, brandBalanceVO);
			
			brandBalanceVOs.add(brandBalanceVO);
			
		}
		
		return brandBalanceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandBalance(BrandBalanceVO brandBalanceVO) {
		
		BrandBalancePO brandBalancePO = new BrandBalancePO();
		
		BeanUtil.copyProperties(brandBalanceVO, brandBalancePO);
		
		brandBalanceDao.save(brandBalancePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandBalance(BrandBalanceVO brandBalanceVO) {
		
		BrandBalancePO brandBalancePO = brandBalanceDao.get(brandBalanceVO.getBbid());
		
		brandBalanceDao.delete(brandBalancePO);

	}

}
