package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.construction.dao.ConstructionAccessoryDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionAccessoryPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructionAccessoryService;
import com.fanglin.construction.vo.ConstructionAccessoryVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.AoodsVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;


@Service("constructionAccessoryService")
@Transactional(readOnly = true)
public class ConstructionAccessoryServiceImpl implements ConstructionAccessoryService{

	@Autowired
	private ConstructionAccessoryDao constructionAccessoryDao;
	
	@Autowired
	private ConstructionDao constructionDao;
		
	@Override
	public void pageConstructionAccessory(Paging paging, List<Filter> filters, ConstructionAccessoryVO constructionAccessoryVO) {
		
		List<ConstructionAccessoryPO> constructionAccessoryPOs = constructionAccessoryDao.pageConstructionAccessory(paging, filters, constructionAccessoryVO.getCid());
		List<ConstructionAccessoryVO> constructionAccessoryVOs = new ArrayList<ConstructionAccessoryVO>();
		
		ConstructionAccessoryVO constructionAccessory;
		
		for (ConstructionAccessoryPO constructionAccessoryPO : constructionAccessoryPOs) {
			
			constructionAccessory = new ConstructionAccessoryVO(new AoodsVO(new GoodsVO(),new AccessoriesTypeVO(new WorkTypeVO())));
			
			BeanUtil.copyProperties(constructionAccessoryPO, constructionAccessory, Arrays.asList("aoods"));
			BeanUtil.copyProperties(constructionAccessoryPO.getAoods(), constructionAccessory.getAoods(), Arrays.asList("goods", "accessoriesType", "bompany"));
			BeanUtil.copyProperties(constructionAccessoryPO.getAoods().getGoods(), constructionAccessory.getAoods().getGoods(), Arrays.asList("accessoriesType"));
			BeanUtil.copyProperties(constructionAccessoryPO.getAoods().getAccessoriesType(), constructionAccessory.getAoods().getAccessoriesType(), Arrays.asList("workType"));
			BeanUtil.copyProperties(constructionAccessoryPO.getAoods().getAccessoriesType().getWorkType(), constructionAccessory.getAoods().getAccessoriesType().getWorkType());
	
			constructionAccessoryVOs.add(constructionAccessory);
		}
		
		paging.setData(constructionAccessoryVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addConstructionAccessory(ConstructionAccessoryVO constructionAccessoryVO) throws FLException {
		
		ConstructionPO constructionPO = constructionDao.get(constructionAccessoryVO.getCid());
		
		if(constructionPO == null){
			throw new FLException(120038, "工程单不存在");
		}
		
		ConstructionAccessoryPO constructionAccessoryPO = new ConstructionAccessoryPO(new AoodsPO());
		
		constructionAccessoryPO.setCid(constructionAccessoryVO.getCid());
		constructionAccessoryPO.getAoods().setAid(constructionAccessoryVO.getAoods().getAid());
		constructionAccessoryPO.setCheckup(constructionAccessoryVO.getCheckup());
		constructionAccessoryPO.setNumLimit(constructionAccessoryVO.getNumLimit());
		
		constructionAccessoryDao.save(constructionAccessoryPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateConstructionAccessory(ConstructionAccessoryVO constructionAccessoryVO) throws FLException {

		ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.get(constructionAccessoryVO.getCaid());
		
		if(constructionAccessoryPO != null){
			constructionAccessoryPO.setCheckup(constructionAccessoryVO.getCheckup());
			constructionAccessoryPO.setNumLimit(constructionAccessoryVO.getNumLimit());
		}
		
		constructionAccessoryDao.update(constructionAccessoryPO);
		
		return 0;
	}

}
