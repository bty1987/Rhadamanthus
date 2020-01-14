package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.production.dao.ProductionFunctionDao;
import com.fanglin.production.po.ProductionFunctionPO;
import com.fanglin.production.service.ProductionFunctionService;
import com.fanglin.production.vo.ProductionFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("productionFunctionService")
@Transactional(readOnly = true)
public class ProductionFunctionServiceImpl implements ProductionFunctionService {

	@Autowired
	private ProductionFunctionDao productionFunctionDao;

	@Override
	public List<ProductionFunctionVO> queryProductionFunction(ProductionFunctionVO productionFunctionVO) {

		List<ProductionFunctionPO> productionFunctionPOs = productionFunctionDao.queryProductionFunction(productionFunctionVO.getType());
		List<ProductionFunctionVO> productionFunctionVOs = new ArrayList<ProductionFunctionVO>();

		for(ProductionFunctionPO productionFunctionPO : productionFunctionPOs){

			productionFunctionVO = new ProductionFunctionVO();
			BeanUtil.copyPropertie(productionFunctionPO,productionFunctionVO);

			productionFunctionVOs.add(productionFunctionVO);
		}

		return productionFunctionVOs;
	}

	@Override
	public List<ProductionFunctionVO> queryProductionFunctionByName(ProductionFunctionVO productionFunctionVO) {

		List<ProductionFunctionPO> productionFunctionPOs = productionFunctionDao.queryProductionFunctionByName(productionFunctionVO.getName());
		List<ProductionFunctionVO> productionFunctionVOs = new ArrayList<ProductionFunctionVO>();

		for(ProductionFunctionPO productionFunctionPO : productionFunctionPOs){

			productionFunctionVO = new ProductionFunctionVO();
			BeanUtil.copyPropertie(productionFunctionPO,productionFunctionVO);

			productionFunctionVOs.add(productionFunctionVO);
		}

		return productionFunctionVOs;
	}

}
