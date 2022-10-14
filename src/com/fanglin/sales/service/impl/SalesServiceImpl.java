package com.fanglin.sales.service.impl;

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
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesDeliveryItemDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesService;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("salesService")
@Transactional(readOnly = true)
public class SalesServiceImpl implements SalesService {

	@Autowired
	private CountingService countingService;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesDeliveryItemDao salesDeliveryItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public List<SalesVO> pageSales(List<SalesPO> salesPOs) {

		List<SalesVO> salesVOs = new ArrayList<SalesVO>();

		for (SalesPO salesPO : salesPOs) {

			SalesVO _salesVO = new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(salesPO, _salesVO, Arrays.asList("salesman", "dept", "region", "guider", "instorer", "guideDept", "house", "customer", "supplier", "finisher"));
			BeanUtil.copyProperties(salesPO.getSupplier(), _salesVO.getSupplier(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesPO.getSalesman(), _salesVO.getSalesman(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesPO.getSalesman().getDept(), _salesVO.getSalesman().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesPO.getDept(), _salesVO.getDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesPO.getRegion(), _salesVO.getRegion(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesPO.getInstorer(), _salesVO.getInstorer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesPO.getInstorer().getDept(), _salesVO.getInstorer().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesPO.getGuider(), _salesVO.getGuider(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesPO.getGuider().getDept(), _salesVO.getGuider().getDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesPO.getGuideDept(), _salesVO.getGuideDept(), Arrays.asList("fatherDept", "type", "manager"));
			BeanUtil.copyProperties(salesPO.getHouse(), _salesVO.getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(salesPO.getHouse().getVillage(), _salesVO.getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(salesPO.getFinisher(), _salesVO.getFinisher(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(salesPO.getCustomer(), _salesVO.getCustomer());

			salesVOs.add(_salesVO);
		}

		return salesVOs;
	}

	@Override
	public void pageSales(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		Integer id = userPO.getUid();

		List<SalesPO> salesPOs = salesDao.pageSales(paging, filter, company, id);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForAdvance(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForAdvance(paging, filter, company);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForBalance(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForBalance(paging, filter, company);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForDompany(Paging paging, List<Filter> filter, String userId, int dompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForDompany(paging, filter, dompany);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForBalanceByDompany(Paging paging, List<Filter> filter, String userId, int dompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForBalanceByDompany(paging, filter, dompany);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForPompany(Paging paging, List<Filter> filters, String userId, int pompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForPompany(paging, filters, pompany);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForBalanceByPompany(Paging paging, List<Filter> filter, String userId, int pompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForBalanceByPompany(paging, filter, pompany);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesForSupplier(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesForSupplier(paging, filter, company, userPO.getUid());
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public void pageSalesByOrderId(Paging paging, List<Filter> filter, int company, String userId, String orderId) {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<SalesPO> salesPOs = salesDao.pageSalesByOrderId(paging, filter, company, orderId);
		List<SalesVO> salesVOs = pageSales(salesPOs);

		paging.setData(salesVOs);
	}

	@Override
	public SalesVO querySalesBySid(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesVO = new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		salesPO.ptv(salesVO);

		return salesVO;
	}

	@Override
	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.querySalesByNo(salesVO.getNo());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesVO = new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		salesPO.ptv(salesVO);

		return salesVO;
	}

	@Override
	public int checkSales(SalesVO salesVO) throws FLException {

		int count = salesDao.countSalesByOrderId(salesVO.getOrderId(), SalesPO.STATUS_INIT_SHORT);

		if (count > 0) {
			throw new FLException(260057, "销售单未完结");
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSales(SalesVO salesVO, List<SalesItemVO> salesItemVOs, int company) throws FLException {

		int dompany = CompanyServiceImpl.decode(salesVO.getDompanys());

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(salesVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationPO.getStatus() == DecorationPO.STATUS_WASTE_INT || decorationPO.getStatus() == DecorationPO.STATUS_TERMINATION_INT) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		SalesPO salesPO = new SalesPO(new HousePO(), new CustomerPO(), new UserPO(), new DepartmentPO(), new DepartmentPO(), new UserPO(), new DepartmentPO(), new UserPO(), new UserPO());

		UserPO salesman = userDao.queryUserByUserId(salesVO.getSalesman().getUserId());
		UserPO guider = userDao.queryUserByUserId(salesVO.getGuider().getUserId());
		UserPO instorer = userDao.queryUserByUserId(salesVO.getInstorer().getUserId());
		BrandPO brandPO = brandDao.get(salesVO.getBid());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_SO_INT, currentDate, company);

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		BeanUtil.copyProperties(salesVO, salesPO, Arrays.asList("salesman", "dept", "region", "guider", "instorer", "brand", "category", "guideDept", "house", "customer", "maling", "venderMaling", "depositpayStatus", "fullpayStatus", "supplier"));

		salesPO.setSalesman(salesman);
		salesPO.setDept(salesman.getDept());
		salesPO.setRegion(salesman.getDept().getFatherDept());
		salesPO.setInstorer(instorer);
		salesPO.setGuider(guider);
		salesPO.setGuideDept(guider.getDept());
		salesPO.setHouse(new HousePO(salesVO.getHouse().getHid()));
		salesPO.setCustomer(new CustomerPO(salesVO.getCustomer().getCid()));
		salesPO.setBrand(brandPO.getName());
		salesPO.setCategory(brandPO.getCategory().getName());
		salesPO.setMaling(0);
		salesPO.setVenderMaling(salesVO.getMaling());
		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setFullpay(0);
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);
		salesPO.setNo(no);
		salesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salesPO.setCompany(company);
		salesPO.setDompany(dompany);
		salesPO.setAmount(salesVO.getTotal());
		salesPO.setTotal(salesVO.getTotal());
		salesPO.setSupplier(brandPO.getSupplier());

		salesPO.setCtype(SalesPO.CTYPE_PASS_INT);
		salesPO.setCvalue(0);

		salesPO.setGrade(decorationPO.getGrade().equals("C") ? "B" : "");

		ActivityPO activityPO = activityDao.queryActivityForDefault(company, ActivityPO.TYPE_SALES_INT);
		salesPO.setActivityId(activityPO == null ? 0 : activityPO.getAid());

		salesDao.save(salesPO);

		SalesItemPO salesItemPO;

		long total = 0l;

		if (salesItemVOs != null && salesItemVOs.size() != 0) {

			for (SalesItemVO salesItemVO : salesItemVOs) {

				salesItemPO = new SalesItemPO(new GoodsPO(salesItemVO.getGoods().getGid()), new ColorPO(salesItemVO.getColor().getCid()), new FormatPO(salesItemVO.getFormat().getFid()));

				BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods", "color", "format"));

				salesItemPO.setSid(salesPO.getSid());
				salesItemPO.setInitnum(salesItemVO.getNum());
				salesItemPO.setPunum(salesItemVO.getNum());
				salesItemPO.setXgnum(salesItemVO.getNum());

				salesItemDao.save(salesItemPO);

				total = Arith.add(total, salesItemVO.getTotal());
			}
		}

		if (total != salesPO.getTotal()) {
			throw new FLException(260059, "销售单总额不必配");
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSales(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setGrade(salesVO.getGrade());

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesForCoupon(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setCoupon(salesVO.getCoupon());
		salesPO.setCouponInfo(salesVO.getCouponInfo());

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesForMaling(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setMaling(salesVO.getMaling());
		salesPO.setVenderMaling(salesVO.getVenderMaling());

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesForActivity(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (!Arrays.asList(SalesPO.STATUS_INIT_SHORT, SalesPO.STATUS_END_SHORT).contains(salesPO.getStatus())) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setActivityId(salesVO.getActivityId());

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesForBelong(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		UserPO salesman = userDao.queryUserByUserId(salesVO.getSalesman().getUserId());
		UserPO guider = userDao.queryUserByUserId(salesVO.getGuider().getUserId());
		UserPO instorer = userDao.queryUserByUserId(salesVO.getInstorer().getUserId());
		UserPO supplier = userDao.queryUserByUserId(salesVO.getSupplier().getUserId());

		salesPO.setSalesman(salesman);
		salesPO.setGuider(guider);
		salesPO.setInstorer(instorer);
		salesPO.setSupplier(supplier);

		salesPO.setDept(salesman.getDept());
		salesPO.setRegion(salesman.getDept().getFatherDept());
		salesPO.setGuideDept(guider.getDept());

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSalesForAdvance(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesPO.setStatus(SalesPO.STATUS_INIT_SHORT);

		salesDao.update(salesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int terminalSales(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getDepositpayStatus() != SalesPO.DESPOSITPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		salesPO.setStatus(SalesPO.STATUS_WAST_SHORT);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishSales(SalesVO salesVO, String userId) throws FLException {

		UserPO finisher = userDao.queryUserByUserId(userId);

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_CONFIRM_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesDeliveryItemDao.countSalesDeliveryItem(salesVO.getSid(), SalesDeliveryItemPO.STATUS_FINISH_INT) > 0) {
			throw new FLException(260066, "配送项状态不可操作");
		}

		salesPO.setStatus(SalesPO.STATUS_END_SHORT);
		salesPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		salesPO.setFinisher(finisher);

		salesDao.update(salesPO);

		return 0;
	}
}
