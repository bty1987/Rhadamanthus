package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.production.dao.ProductionUserWorkFlowDao;
import com.fanglin.production.po.ProductionUserWorkFlowPO;
import com.fanglin.production.service.ProductionUserWorkFlowService;
import com.fanglin.production.vo.ProductionUserWorkFlowVO;
import com.fanglin.production.vo.ProductionWorkFlowVO;
import com.fanglin.utils.BeanUtil;

@Service("ProductionUserWorkFlowService")
@Transactional(readOnly = true)
public class ProductionUserWorkFlowServiceImpl implements ProductionUserWorkFlowService {
	@Autowired
	private ProductionUserWorkFlowDao productionUserWorkFlowDao;
	
	@Override
	public List<ProductionUserWorkFlowVO> queryProductionUserWorkFlowByPwfid(ProductionUserWorkFlowVO productionUserWorkFlowVO) throws FLException {
		List<ProductionUserWorkFlowPO> productionUserWorkFlowPOs = productionUserWorkFlowDao.queryProductionUserWorkFlowByPwfid(productionUserWorkFlowVO.getProductionworkflow().getPwfid());
		List<ProductionUserWorkFlowVO> productionUserWorkFlowVOs = null;
		
		if(productionUserWorkFlowPOs.size() != 0){
			
			productionUserWorkFlowVOs = new ArrayList<ProductionUserWorkFlowVO>();
			
			for(ProductionUserWorkFlowPO productionUserWorkFlowPO : productionUserWorkFlowPOs){
				productionUserWorkFlowVO = new ProductionUserWorkFlowVO(new ProductionWorkFlowVO(), new UserVO());
				BeanUtil.copyProperties(productionUserWorkFlowPO, productionUserWorkFlowVO, Arrays.asList("productionworkflow","operator"));
				BeanUtil.copyProperties(productionUserWorkFlowPO.getProductionworkflow(), productionUserWorkFlowVO.getProductionworkflow(), Arrays.asList("workflow"));
				BeanUtil.copyProperties(productionUserWorkFlowPO.getOperator(), productionUserWorkFlowVO.getOperator(), Arrays.asList("role","dept","contracts","experiences"));
				productionUserWorkFlowVOs.add(productionUserWorkFlowVO);
			}			
			
		}
		return productionUserWorkFlowVOs;
		
		
		
		
	}

}
