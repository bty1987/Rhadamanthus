package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.dao.ProductionUserWorkFlowDao;
import com.fanglin.production.po.ProductionUserWorkFlowPO;
import com.fanglin.production.service.ProductionUserWorkFlowService;
import com.fanglin.production.vo.ProductionUserWorkFlowVO;
import com.fanglin.utils.BeanUtil;

@Service("ProductionUserWorkFlowService")
@Transactional(readOnly = true)
public class ProductionUserWorkFlowServiceImpl implements ProductionUserWorkFlowService {
	@Autowired
	private ProductionUserWorkFlowDao productionUserWorkFlowDao;
	
	@Override
	public List<ProductionUserWorkFlowVO> queryProductionUserWorkFlowByPwfid(ProductionUserWorkFlowVO productionUserWorkFlowVO) throws FLException {
		List<ProductionUserWorkFlowPO> productionUserWorkFlowPOs = productionUserWorkFlowDao.queryProductionUserWorkFlowByPwfid(productionUserWorkFlowVO.getPwfid().getPwfid());
		
		if(productionUserWorkFlowPOs.size() == 0){
			throw new FLException(220012, "工序暂无人操作");
		}
		
		List<ProductionUserWorkFlowVO> productionUserWorkFlowVOs = new ArrayList<ProductionUserWorkFlowVO>();
		
		for(ProductionUserWorkFlowPO productionUserWorkFlowPO : productionUserWorkFlowPOs){
			productionUserWorkFlowVO = new ProductionUserWorkFlowVO();
			BeanUtil.copyProperties(productionUserWorkFlowPO, productionUserWorkFlowVO, Arrays.asList("pwfid","ouid"));
			BeanUtil.copyProperties(productionUserWorkFlowPO.getPwfid(), productionUserWorkFlowVO.getPwfid(), Arrays.asList("workflow"));
			BeanUtil.copyProperties(productionUserWorkFlowPO.getOuid(), productionUserWorkFlowVO.getOuid(), Arrays.asList("role","dept","contracts","experiences"));
			productionUserWorkFlowVOs.add(productionUserWorkFlowVO);
		}
		return productionUserWorkFlowVOs;
	}

}
