package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;

import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.service.ProductionService;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;


@Service("productionService")
@Transactional(readOnly=true)
public class ProductionServiceImpl implements ProductionService {
	
	@Autowired
	private ProductionDao productionDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private VillageDao villageDao;
	
	@Autowired
	private CountingService countingService;

	@Override
	public void pageProduction(Paging paging, List<Filter> filters, int company) {
		
		List<ProductionPO> productionPOs = productionDao.pageProduction(paging, filters, company);
		List<ProductionVO> productionVOs = new ArrayList<ProductionVO>();
		
		ProductionVO productionVO;
		
		for(ProductionPO productionPO:productionPOs){
			
			productionVO = new ProductionVO(new VillageVO(), new UserVO(), new UserVO());
			
			BeanUtil.copyProperties(productionPO, productionVO, Arrays.asList("village","creater","designer"));
			BeanUtil.copyProperties(productionPO.getVillage(), productionVO.getVillage(),Arrays.asList("cityProper","buildingNameRule"));
			BeanUtil.copyProperties(productionPO.getCreater(), productionVO.getCreater(),Arrays.asList("role","dept","contracts","experiences"));
			BeanUtil.copyProperties(productionPO.getDesigner(), productionVO.getDesigner(),Arrays.asList("role","dept","contracts","experiences"));
			
			productionVOs.add(productionVO);
		}
		
		paging.setData(productionVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addProduction(ProductionVO productionVO,String userId,int company) throws FLException{
		
		ProductionPO productionPO = new ProductionPO(new VillagePO(), new UserPO(), new UserPO());
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT , currentDate);
		
		String no = "P"+currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		UserPO designer = userDao.queryUserByUserId(productionVO.getDesigner().getUserId());
		UserPO creater = userDao.queryUserByUserId(userId);
		VillagePO village = villageDao.get(productionVO.getVillage().getVillageId());
		
		BeanUtil.copyProperties(productionVO, productionPO, Arrays.asList("village","creater","designer"));
		BeanUtil.copyProperties(designer, productionPO.getDesigner(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(creater, productionPO.getCreater(),Arrays.asList("role","dept","contracts","experiences"));
		BeanUtil.copyProperties(village, productionPO.getVillage(),Arrays.asList("cityProper","buildingNameRule"));
		productionPO.setCompany(company);
		productionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setPno(no);
	
		productionDao.save(productionPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateProductionForStatus(ProductionVO productionVO) throws FLException{
		
		ProductionPO productionPO = productionDao.get(productionVO.getPid());
		
		if(productionPO == null){
			throw new FLException(220001,"生产单不存在");
		}
		
		if(productionPO.getStatus() == ProductionPO.STATUS_DESTORY_SHORT || productionPO.getStatus() == ProductionPO.STATUS_END_SHORT){
			throw new FLException(220002,"生产单状态不可操作");
		}
		
		if(productionVO.getStatus() == ProductionPO.STATUS_CONFIRM_SHORT){
			productionPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		if(productionVO.getStatus() == ProductionPO.STATUS_PRODUCT_SHORT ){
			
			if(productionPO.getStatus() != 2){
				throw new FLException(220002,"生产单状态不可操作");
			}
			
			productionPO.setDivideTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		productionPO.setStatus(productionVO.getStatus());
		
		productionDao.update(productionPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateProductionForDeliveryStatus(ProductionVO productionVO) throws FLException{
		
		ProductionPO productionPO = productionDao.get(productionVO.getPid());
		
		if(productionPO == null){
			
			throw new FLException(220001,"生产单不存在");
		}
		
		if(productionVO.getDiliverystatus() == ProductionPO.DELIVERSTATUS_DELIVERED_SHORT){
			
			productionPO.setStatus(ProductionPO.STATUS_END_SHORT);
			
		}
		
		productionPO.setDiliverystatus(productionVO.getDiliverystatus());
		productionPO.setDiliveryTime(DateUtil.getDateToTimestamp(new Date()));
	
		productionDao.update(productionPO);
		
		return 0;
	}

}
