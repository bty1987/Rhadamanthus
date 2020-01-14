package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.dao.TranpackDao;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.production.service.ProductionPlanService;
import com.fanglin.production.vo.ProductionPlanVO;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
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
	
	@Autowired
	private ProductionDao productionDao;
	
	@Autowired
	private CompanyDao companyDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private TranpackDao tranpackDao;

	@Override
	public void pageProductionPlan(Paging paging, List<Filter> filter, int company) {
		
		List<ProductionPlanPO> productionPlanPOs = productionPlanDao.pageProductionPlan(paging, filter, company);
		List<ProductionPlanVO> productionPlanVOs = new ArrayList<ProductionPlanVO>();

		for (ProductionPlanPO productionPlanPO : productionPlanPOs) {
			
			productionPlanVOs.add(copyProductionPlanVO(productionPlanPO));
		}
		
		paging.setData(productionPlanVOs);

	}

	@Override
	public List<ProductionPlanVO> queryProductionPlanByPid(ProductionPlanVO productionPlanVO) {
		
		List<ProductionPlanPO> productionPlanPOs = productionPlanDao.queryProductionPlanByPid(productionPlanVO.getProduction().getPid());
		List<ProductionPlanVO> productionPlanVOs = new ArrayList<ProductionPlanVO>();

		for (ProductionPlanPO productionPlanPO : productionPlanPOs) {
			productionPlanVOs.add(copyProductionPlanVO(productionPlanPO));
		}

		return productionPlanVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addProductionPlan(ProductionPlanVO productionPlanVO, int company, String userId) throws FLException {
		
		CompanyPO companyPO = companyDao.get(company);
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		ProductionPO productionPO = productionDao.get(productionPlanVO.getProduction().getPid());
		
		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在"); 
		}
		
		if (productionPO.getStatus() != ProductionPO.STATUS_SPLIT_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		ProductionPlanPO productionPlanPO = new ProductionPlanPO();

		String currentDate = DateUtil.current("yyMMdd").toString();
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);
			
		String no =  companyPO.getShortname() +"Z" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		BeanUtil.copyProperties(productionPlanVO, productionPlanPO, Arrays.asList("creater", "production"));
		
		productionPlanPO.setNo(no);
		productionPlanPO.setPath("");
		productionPlanPO.setProduction(productionPO);
		productionPlanPO.setCreater(creater);
		productionPlanPO.setCompany(company);
		productionPlanPO.setStatus(ProductionPlanPO.STATUS_CREATE_INT);
		productionPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		productionPlanDao.save(productionPlanPO);
		
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		productionDao.update(productionPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProductionPlan(ProductionPlanVO productionPlanVO) throws FLException {

		ProductionPlanPO productionPlanPO = productionPlanDao.get(productionPlanVO.getPpid());

		if (productionPlanPO == null) {
			throw new FLException(220008, "计划单不存在");
		}
		
		productionPlanPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		productionPlanPO.setPath(productionPlanVO.getPath());

		productionPlanDao.update(productionPlanPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishProductionPlan(ProductionPlanVO productionPlanVO, String userId) throws FLException {
		
		ProductionPlanPO productionPlanPO = productionPlanDao.get(productionPlanVO.getPpid());
		
		if (productionPlanPO == null) {
			throw new FLException(220008, "计划单不存在");
		}
		
		if (productionPlanPO.getStatus() != ProductionPlanPO.STATUS_CREATE_INT) {
			throw new FLException(220021, "计划单状态不可操作");
		}
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		for(int i = 1; i <= productionPlanVO.getNum(); i++){
			
			String no = productionPlanPO.getNo() + "-" + i;
			TranpackPO tranpackPO = new TranpackPO();
			
			tranpackPO.setNo(no);
			tranpackPO.setType(TranpackPO.TYPE_PRODUCTIONPLAN_INT);
			tranpackPO.setCreater(creater);
			tranpackPO.setProduction(productionPlanPO.getProduction());
			tranpackPO.setRid(productionPlanPO.getPpid());
			tranpackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			
			tranpackDao.save(tranpackPO);
		}
		
		productionPlanPO.setStatus(ProductionPlanPO.STATUS_FINISH_INT);
		productionPlanPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		productionPlanPO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		
		productionPlanDao.update(productionPlanPO);
		
		return 0;
	}

	private ProductionPlanVO copyProductionPlanVO(ProductionPlanPO productionPlanPO) {
		
		ProductionPlanVO productionPlanVO = new ProductionPlanVO(new ProductionVO(new HouseVO(new VillageVO())),new UserBaseVO());
		
		BeanUtil.copyProperties(productionPlanPO, productionPlanVO, Arrays.asList("creater", "production"));
		BeanUtil.copyProperties(productionPlanPO.getCreater(), productionPlanVO.getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(productionPlanPO.getProduction(), productionPlanVO.getProduction(), Arrays.asList("house", "creater", "brand", "salesman", "designer", "spliter"));
		BeanUtil.copyProperties(productionPlanPO.getProduction().getHouse(), productionPlanVO.getProduction().getHouse(), Arrays.asList("village"));
		BeanUtil.copyPropertie(productionPlanPO.getProduction().getHouse().getVillage(), productionPlanVO.getProduction().getHouse().getVillage(), Arrays.asList("cityProper"));
		
		return productionPlanVO;
	}
}
