package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.service.ProductionPlanService;
import com.fanglin.production.vo.ProductionPlanVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("ProductionPlanService")
@Transactional(readOnly = true)
public class ProductionPlanServiceImpl implements ProductionPlanService {

	@Autowired
	private ProductionPlanDao productionPlanDao;
	@Autowired
	private CountingService countingService;
	@Override
	public void pageProductionPlan(Paging paging, List<Filter> filter,long pid) {
		List<ProductionPlanPO> productionPlanPOs = productionPlanDao.pageProductionPlan(paging, filter,pid);
		List<ProductionPlanVO> productionPlanVOs = new ArrayList<ProductionPlanVO>();
		
		for(ProductionPlanPO productionPlanPO : productionPlanPOs){
			ProductionPlanVO productionPlanVO = new ProductionPlanVO();
			BeanUtil.copyProperties(productionPlanPO, productionPlanVO);
			productionPlanVOs.add(productionPlanVO);
		}
		paging.setData(productionPlanVOs);

	}

	
	@Override
	public List<ProductionPlanVO> queryProductionPlanByPid(ProductionPlanVO productionPlanVO) {
		List<ProductionPlanPO> productionPlanPOs =  productionPlanDao.queryProductionPlanByPid(productionPlanVO.getPid());
		List<ProductionPlanVO> productionPlanVOs = new ArrayList<ProductionPlanVO>();
		
		for(ProductionPlanPO productionPlanPO : productionPlanPOs){
			productionPlanVO = new ProductionPlanVO();
			BeanUtil.copyProperties(productionPlanPO, productionPlanVO);
			productionPlanVOs.add(productionPlanVO);
		}
		return productionPlanVOs;
	}
	
	@Override
	public ProductionPlanVO queryProductionPlanByNo(ProductionPlanVO productionPlanVO) throws FLException {
		
		ProductionPlanPO productionPlanPO = productionPlanDao.queryProductionPlanByNo(productionPlanVO.getNo());
		if(productionPlanPO == null){
			throw new FLException(220008, "计划单不存在");
		}
	     productionPlanVO = new ProductionPlanVO();
	     BeanUtil.copyProperties(productionPlanPO, productionPlanVO);		
		return productionPlanVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addProductionPlan(ProductionPlanVO productionPlanVO) throws FLException{
		
		ProductionPlanPO productionPlanPO = new ProductionPlanPO();
		String currentDate = DateUtil.current("yyyyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT , currentDate);
		String no = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
		BeanUtil.copyProperties(productionPlanVO, productionPlanPO);
		productionPlanPO.setNo(no);
		productionPlanPO.setPath("");
		productionPlanDao.save(productionPlanPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateProductionPlan(ProductionPlanVO productionPlanVO) throws FLException {
		ProductionPlanPO productionPlanPO = productionPlanDao.get(productionPlanVO.getPpid());
		
		if(productionPlanPO == null){
			throw new FLException(220008, "计划单不存在");
		}
		if(productionPlanVO.getPath() != null){
			productionPlanPO.setPath(productionPlanVO.getPath());
		}
		if(productionPlanVO.getStartTime()!=null){
			productionPlanPO.setStartTime(productionPlanVO.getStartTime());
		}
		if(productionPlanVO.getEndTime()!=null){
			productionPlanPO.setEndTime(productionPlanVO.getEndTime());
		}
			
		productionPlanDao.update(productionPlanPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateProductionPlanForStatus(ProductionPlanVO productionPlanVO) throws FLException {
		
		ProductionPlanPO productionPlanPO = productionPlanDao.get(productionPlanVO.getPpid());
		if(productionPlanPO == null){
			throw new FLException(220008, "计划单不存在");
		}
		productionPlanPO.setStatus(productionPlanVO.getStatus());
		
		productionPlanDao.update(productionPlanPO);
		return 0;
	}


}
