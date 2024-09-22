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
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CategoryVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.HardwareDao;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.dao.TranpackDao;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.production.service.ProductionService;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("productionService")
@Transactional(readOnly = true)
public class ProductionServiceImpl implements ProductionService {

	@Autowired
	private ProductionDao productionDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private OutsourceDao outsourceDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private HardwareDao hardwareDao;

	@Autowired
	private ProductionPlanDao productionPlanDao;

	@Autowired
	private TranpackDao tranpackDao;

	@Override
	public void pageProduction(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0) return;

		List<ProductionPO> productionPOs = productionDao.pageProduction(paging, filters, company);
		List<ProductionVO> productionVOs = new ArrayList<ProductionVO>();

		for (ProductionPO productionPO : productionPOs) {

			ProductionVO productionVO = new ProductionVO(new HouseVO(new VillageVO()), new BrandVO(), new CategoryVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(productionPO, productionVO, Arrays.asList("house", "creater", "brand", "salesman", "designer", "spliter"));
			BeanUtil.copyProperties(productionPO.getHouse(), productionVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(productionPO.getHouse().getVillage(), productionVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(productionPO.getCreater(), productionVO.getCreater(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(productionPO.getSalesman(), productionVO.getSalesman(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(productionPO.getDesigner(), productionVO.getDesigner(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(productionPO.getSpliter(), productionVO.getSpliter(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(productionPO.getBrand(), productionVO.getBrand(), Arrays.asList("supplier", "category"));
			BeanUtil.copyProperties(productionPO.getBrand().getCategory(), productionVO.getCategory());

			productionVOs.add(productionVO);
		}

		paging.setData(productionVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addProduction(ProductionVO productionVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		ProductionPO productionPO = new ProductionPO();

		if (productionVO.getSpid() != null) {

			productionPO = productionDao.queryProductionByPno(productionVO.getSpid());

			if (productionPO == null) {
				throw new FLException(220001, "生产单不存在");
			}

			productionVO.setSpid(productionPO.getPno());
			productionVO.setOrderId(productionPO.getOrderId());
			productionVO.setType(ProductionPO.TYPE_AFTERSERVICE_SHORT);
			productionVO.setHouse(new HouseVO(productionPO.getHouse().getHid()));
		}

		productionPO = new ProductionPO(new HousePO(), new BrandPO(), new UserPO(), new UserPO(), new UserPO(), new UserPO());

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_PRODUCTION_ZO_INT, currentDate, company);
		String no = companyPO.getShortname() + "P" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		UserPO designer = userDao.queryUserByUserId(productionVO.getDesigner().getUserId());
		UserPO salesman = userDao.queryUserByUserId(productionVO.getSalesman().getUserId());
		UserPO creater = userDao.queryUserByUserId(userId);
		BrandPO brand = brandDao.queryBrandByBid(productionVO.getBrand().getBid());

		if (productionVO.getSpliter().getUserId() != null) {
			UserPO spliter = userDao.queryUserByUserId(productionVO.getSpliter().getUserId());
			productionPO.setSpliter(spliter);
		}

		BeanUtil.copyProperties(productionVO, productionPO, Arrays.asList("house", "creater", "brand", "category", "salesman", "designer", "spliter"));
		BeanUtil.copyProperties(productionVO.getHouse(), productionPO.getHouse(), Arrays.asList("village"));

		productionPO.setPno(no);
		productionPO.setBrand(brand);
		productionPO.setCreater(creater);
		productionPO.setDesigner(designer);
		productionPO.setSalesman(salesman);
		productionPO.setCompany(company);
		productionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.save(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {

			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() == ProductionPO.STATUS_INIT_SHORT || productionPO.getStatus() == ProductionPO.STATUS_DESIGN_SHORT) {

			if (productionPO.getStatus() == ProductionPO.STATUS_INIT_SHORT) {
				UserPO designer = userDao.queryUserByUserId(productionVO.getDesigner().getUserId());
				productionPO.setDesigner(designer);
			}

			UserPO salesman = userDao.queryUserByUserId(productionVO.getSalesman().getUserId());
			UserPO spliter = userDao.queryUserByUserId(productionVO.getSpliter().getUserId());
			productionPO.setSalesman(salesman);
			productionPO.setSpliter(spliter);
		}

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateProductionForAdvance(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		UserPO designer = userDao.queryUserByUserId(productionVO.getDesigner().getUserId());
		UserPO salesman = userDao.queryUserByUserId(productionVO.getSalesman().getUserId());
		UserPO spliter = userDao.queryUserByUserId(productionVO.getSpliter().getUserId());

		productionPO.setDesigner(designer);
		productionPO.setSalesman(salesman);
		productionPO.setSpliter(spliter);
		productionPO.setTimeLimit(productionVO.getTimeLimit());

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int designProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_DESIGN_SHORT);
		productionPO.setDesignTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int splitProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_DESIGN_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_SPLIT_SHORT);
		productionPO.setDivideTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int instoreProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_SPLIT_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		Integer countOutsource = outsourceDao.countOutsource(productionPO.getPid(), OutsourcePO.STATUS_END_SHORT);
		Integer countHardware = hardwareDao.countHardware(productionPO.getPid(), HardwarePO.STATUS_FINISH_SHORT);
		Integer countProductionPlan = productionPlanDao.countProductionPlan(productionPO.getPid(), ProductionPlanPO.STATUS_FINISH_INT);
		Integer countTranpackByPid = tranpackDao.countTranpackByPid(productionPO.getPid(), TranpackPO.STATUS_INSTORE_SHORT);

		if (countOutsource > 0) {
			throw new FLException(220002, "生产单状态不可操作");
		} else if (countHardware > 0) {
			throw new FLException(220002, "生产单状态不可操作");
		} else if (countProductionPlan > 0) {
			throw new FLException(220002, "生产单状态不可操作");
		} else if (countTranpackByPid > 0) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_INSTORE_SHORT);
		productionPO.setStoreTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int planProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_INSTORE_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		Integer countTranpackByPid = tranpackDao.countTranpackByPid(productionPO.getPid(), TranpackPO.STATUS_INSTORE_SHORT);

		if (countTranpackByPid > 0) {
			throw new FLException(220025, "物流包状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_PLAN_SHORT);
		productionPO.setPlanTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		tranpackDao.updateTranpack(productionPO.getPid(), TranpackPO.STATUS_LOGISTICS_SHORT);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int tranProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_PLAN_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_TRANSPORT_SHORT);
		productionPO.setTranTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int mountProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_TRANSPORT_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_MOUNT_SHORT);
		productionPO.setMountTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int upholdProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_COMPLETE_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_UPHOLD_SHORT);
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_COMPLETE_SHORT && productionPO.getStatus() != ProductionPO.STATUS_UPHOLD_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_FINISH_SHORT);
		productionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int terminalProduction(ProductionVO productionVO) throws FLException {

		ProductionPO productionPO = productionDao.get(productionVO.getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT && productionPO.getStatus() != ProductionPO.STATUS_DESIGN_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		productionPO.setStatus(ProductionPO.STATUS_TERMINAL_SHORT);
		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));

		productionDao.update(productionPO);

		return 0;
	}

}
