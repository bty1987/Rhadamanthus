package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.dao.ProductionPlanItemDao;
import com.fanglin.production.po.ProductionPlanItemPO;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.service.ProductionPlanItemService;
import com.fanglin.production.vo.ProductionPlanItemVO;
import com.fanglin.production.vo.ProductionPlanVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("ProductionPlanItemService")
@Transactional(readOnly = true)
public class ProductionPlanItemServiceImpl implements ProductionPlanItemService {
	
	@Autowired
	private ProductionPlanItemDao productionPlanItemDao;
	@Autowired
	private ProductionPlanDao productionPlanDao;

	@Override
	public void pageProductionPlanItemByPpid(Paging paging, List<Filter> filters,long ppid) {
		List<ProductionPlanItemPO> productionPlanItemPOs = productionPlanItemDao.pageProductionPlanItemByPpid(paging,filters,ppid);
		List<ProductionPlanItemVO> productionPlanItemVOs = new ArrayList<ProductionPlanItemVO>();
		
		for(ProductionPlanItemPO productionPlanItemPO : productionPlanItemPOs){
			ProductionPlanItemVO productionPlanItemVO = new ProductionPlanItemVO(new ProductionPlanVO());
			BeanUtil.copyProperties(productionPlanItemPO, productionPlanItemVO,Arrays.asList("productionPlan"));
			BeanUtil.copyProperties(productionPlanItemPO.getProductionPlan(), productionPlanItemVO.getProductionPlan());			
			productionPlanItemVOs.add(productionPlanItemVO);
		}
		paging.setData(productionPlanItemVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addProductionPlanItem(ProductionPlanItemVO productionPlanItemVO) throws FLException {
		
		ProductionPlanPO productionPlanPO = productionPlanDao.get(productionPlanItemVO.getProductionPlan().getPpid());
		
		if(productionPlanPO == null){
			throw new FLException(220008, "该生产计划单不存在");
		}
		
		ProductionPlanItemPO productionPlanItemPO = new ProductionPlanItemPO(new ProductionPlanPO());
		BeanUtil.copyProperties(productionPlanItemVO, productionPlanItemPO,Arrays.asList("productionPlan"));
		BeanUtil.copyPropertie(productionPlanItemVO.getProductionPlan(), productionPlanItemPO.getProductionPlan());
		productionPlanItemDao.save(productionPlanItemPO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteProductionPlanItem(ProductionPlanItemVO productionPlanItemVO) throws FLException {
	
		ProductionPlanItemPO productionPlanItemPO = productionPlanItemDao.get(productionPlanItemVO.getPpiid());
		
		if(productionPlanItemPO == null){
			throw new FLException(220008, "该生产计划项不存在");
		}
		
		productionPlanItemDao.delete(productionPlanItemPO);
		
		return 0;
	}

}
