package com.fanglin.sales.service.impl;

import java.sql.Timestamp;
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
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.material.dao.GoodsPackageDao;
import com.fanglin.data.po.ColorPO;
import com.fanglin.data.po.FormatPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.GoodsPackagePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.payment.po.SalesReceiptPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesDao;
import com.fanglin.sales.dao.SalesDeliveryItemDao;
import com.fanglin.sales.dao.SalesItemDao;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.sales.po.SalesItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.service.SalesBalanceService;
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
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.utils.Paging;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("salesService")
@Transactional(readOnly = true)
public class SalesServiceImpl implements SalesService {

	@Autowired
	private CountingService countingService;

	@Autowired
	private SalesDao salesDao;

	@Autowired
	private SalesItemDao salesItemDao;

	@Autowired
	private SalesDeliveryItemDao salesDeliveryItemDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private SalesReceiptDao salesReceiptDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SalesBalanceService salesBalanceService;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private GoodsPackageDao goodsPackageDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Override
	public List<SalesVO> pageSales(List<SalesPO> salesPOs) {

		List<SalesVO> salesVOs = new ArrayList<SalesVO>();

		for (SalesPO salesPO : salesPOs) {
			salesVOs.add(salesPO.ptv(new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentVO())), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new DepartmentVO(), new UserBaseVO(new DutyVO(), new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO())));
		}

		return salesVOs;
	}

	@Override
	public void pageSales(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		paging.setData(pageSales(salesDao.pageSales(paging, filter, company, userPO.getUid())));
	}

	@Override
	public void pageSalesForAdvance(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		paging.setData(pageSales(salesDao.pageSalesForAdvance(paging, filter, company)));
	}

	@Override
	public void pageSalesForBalance(Paging paging, List<Filter> filter, String userId, int company) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		paging.setData(pageSales(salesDao.pageSalesForBalance(paging, filter, company)));
	}

	@Override
	public void pageSalesForDompany(Paging paging, List<Filter> filter, String userId, int dompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		paging.setData(pageSales(salesDao.pageSalesForDompany(paging, filter, dompany)));
	}

	@Override
	public void pageSalesForBalanceByDompany(Paging paging, List<Filter> filter, String userId, int dompany) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		paging.setData(pageSales(salesDao.pageSalesForBalanceByDompany(paging, filter, dompany)));
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

		salesVO = new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO());

		salesPO.ptv(salesVO);

		return salesVO;
	}

	@Override
	public SalesVO querySalesByNo(SalesVO salesVO) throws FLException {

		SalesPO salesPO = salesDao.querySalesByNo(salesVO.getNo());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		salesVO = new SalesVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new BrandVO());

		salesPO.ptv(salesVO);

		return salesVO;
	}

	@Override
	public long amountSales(SalesVO salesVO) throws FLException {

		Long amount = salesDao.amountSales(salesVO.getOrderId(), salesVO.getType());

		return amount;
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
	public int addSales(SalesVO salesVO, List<SalesItemVO> salesItemVOs, String userId, int company) throws FLException {

		int dompany = CompanyServiceImpl.decode(salesVO.getDompanys());

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(salesVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationPO.getStatus() == DecorationPO.STATUS_WASTE_INT) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		SalesPO salesPO = new SalesPO(new HousePO(), new CustomerPO(), new UserPO(), new DepartmentPO(), new DepartmentPO(), new UserPO(), new DepartmentPO(), new UserPO(), new UserPO(), new BrandPO());

		UserPO salesman = userDao.queryUserByUserId(salesVO.getSalesman().getUserId());
		UserPO guider = userDao.queryUserByUserId(salesVO.getGuider().getUserId());
		UserPO instorer = userDao.queryUserByUserId(salesVO.getInstorer().getUserId());
		BrandPO brand = brandDao.get(salesVO.getBrand().getBid());
		UserPO supplier = userDao.queryUserByUserId(salesVO.getSupplier().getUserId());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_SALES_INT, currentDate, company);

		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		BeanUtil.copyProperties(salesVO, salesPO, Arrays.asList("salesman", "dept", "region", "guider", "instorer", "brand", "category", "guideDept", "house", "customer", "maling", "venderMaling", "depositpayStatus", "fullpayStatus", "supplier"));

		salesPO.setNo(no);
		salesPO.setSalesman(salesman);
		salesPO.setDept(decorationPO.getDesignDept());
		salesPO.setRegion(decorationPO.getDesignDept().getFatherDept());
		salesPO.setCreater(creater);
		salesPO.setSupplier(supplier);
		salesPO.setInstorer(instorer);
		salesPO.setGuider(guider);
		salesPO.setGuideDept(guider.getDept());
		salesPO.setHouse(decorationPO.getHouse());
		salesPO.setCustomer(decorationPO.getCustomer());
		salesPO.setBrand(brand);
		salesPO.setCategory(brand.getCategory().getName());

		salesPO.setAmount(salesVO.getTotal());
		salesPO.setTotal(salesVO.getTotal());
		salesPO.setMaling(0);
		salesPO.setVenderMaling(salesVO.getMaling());
		salesPO.setDepositpay(0);
		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_INIT_SHORT);
		salesPO.setFullpay(0);
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_INIT_SHORT);

		salesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		salesPO.setCompany(company);
		salesPO.setDompany(dompany);

		salesPO.setCtype(SalesPO.CTYPE_PASS_INT);
		salesPO.setCvalue(0);

		if (salesVO.getGrade() == null) salesPO.setGrade("B");
		else salesPO.setGrade(salesVO.getGrade());

		ActivityPO activityPO = activityDao.queryActivityForDefault(company, ActivityPO.TYPE_SALES_INT);
		salesPO.setActivityId(activityPO == null ? 0 : activityPO.getAid());

		salesDao.save(salesPO);

		SalesItemPO salesItemPO;

		long total = 0l;

		if (salesItemVOs == null) return 0;

		if (salesItemVOs.size() == 0) return 0;

		for (SalesItemVO salesItemVO : salesItemVOs) {

			if (salesItemVO.getGoods() == null || salesItemVO.getGoods().getGid() == null) continue;

			GoodsPO goodsPO = goodsDao.get(salesItemVO.getGoods().getGid());

			if (goodsPO == null) continue;

			if (salesItemVO.getColor() == null || salesItemVO.getColor().getCid() == null) continue;
			if (salesItemVO.getFormat() == null || salesItemVO.getFormat().getFid() == null) continue;

			salesItemPO = new SalesItemPO(new GoodsPO(salesItemVO.getGoods().getGid()), new ColorPO(salesItemVO.getColor().getCid()), new FormatPO(salesItemVO.getFormat().getFid()));

			BeanUtil.copyProperties(salesItemVO, salesItemPO, Arrays.asList("goods", "color", "format"));

			salesItemPO.setSid(salesPO.getSid());
			salesItemPO.setType(goodsPO.getType());
			salesItemPO.setInitnum(salesItemVO.getNum());
			salesItemPO.setPunum(salesItemVO.getNum());
			salesItemPO.setXgnum(salesItemVO.getNum());

			salesItemDao.save(salesItemPO);

			total = Arith.add(total, salesItemVO.getTotal());

			if (goodsPO == null || goodsPO.getType() != GoodsPO.TYPE_SUIT_INT) continue;

			// 套餐类型商品，需要展开套餐明细
			List<GoodsPackagePO> goodsPackages = goodsPackageDao.queryGoodsPackage(goodsPO.getGid());

			if (goodsPackages == null || goodsPackages.isEmpty()) continue;

			for (GoodsPackagePO goodsPackagePO : goodsPackages) {

				SalesItemPO salesItemGP = new SalesItemPO(goodsPackagePO.getGoods(), goodsPackagePO.getColor(), goodsPackagePO.getFormat());

				BeanUtil.copyProperties(goodsPackagePO, salesItemGP, Arrays.asList("goods", "color", "format"));

				// 复制价格等基本信息
				salesItemGP.setSid(salesPO.getSid());
				salesItemGP.setPsiid(salesItemPO.getSiid()); // 关联父销售项
				salesItemGP.setType(SalesItemPO.TYPE_PACKAGE_INT); // 标记为套餐明细

				salesItemGP.setPurchase(goodsPackagePO.getPurchase());
				salesItemGP.setSelling(goodsPackagePO.getSelling());
				salesItemGP.setDiscount(1000);
				salesItemGP.setDisPrice(goodsPackagePO.getSelling());
				salesItemGP.setPostDis(1000);
				salesItemGP.setPrice(goodsPackagePO.getSelling());

				long num = Arith.mul(salesItemPO.getNum(), goodsPackagePO.getNum());

				salesItemGP.setInitnum(goodsPackagePO.getNum());
				salesItemGP.setNum(num);
				salesItemGP.setPunum(num);
				salesItemGP.setXgnum(num);

				salesItemGP.setTotal(Arith.mul(num, goodsPackagePO.getSelling()));

				salesItemDao.save(salesItemGP);
			}
		}

		if (total != salesPO.getTotal()) {
			throw new FLException(260059, "销售单总额不匹配");
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
	public int unpaySales(SalesVO salesVO, String userId) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		if (salesPO.getStatus() != SalesPO.STATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getDepositpayStatus() != SalesPO.DESPOSITPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getFullpayStatus() != SalesPO.FULLPAYSTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}

		if (salesPO.getBalanceStatus() != SalesPO.BALANCESTATUS_INIT_SHORT) {
			throw new FLException(260022, "销售单状态不可操作");
		}
		if (salesItemDao.countSalesItem(salesVO.getSid()) == 0) {
			throw new FLException(260060, "销售项数量不足");
		}

		if (salesPaymentDao.countSalesPayment(salesPO.getSid(), null) > 0) {
			throw new FLException(150002, "款项已存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);
		Timestamp current = DateUtil.getDateToTimestamp(new Date());

		salesPO.setDepositpayStatus(SalesPO.DESPOSITPAYSTATUS_CONFIRM_SHORT);
		salesPO.setFullpayStatus(SalesPO.FULLPAYSTATUS_CONFIRM_SHORT);
		salesPO.setFullpayTime(current);
		salesPO.setFullpay(salesPO.getTotal());
		salesPO.setPompany(salesPO.getCompany());

		salesBalanceService.preSalesBalance(Arrays.asList(salesPO.getSid()), userId);

		SalesReceiptPO salesReceiptPO = new SalesReceiptPO();

		salesReceiptPO.setCollecter(operater);
		salesReceiptPO.setCollecterName(operater.getUserName());
		salesReceiptPO.setCollectTime(current);
		salesReceiptPO.setConfirmer(operater);
		salesReceiptPO.setConfirmerName(operater.getUserName());
		salesReceiptPO.setConfirmTime(current);
		salesReceiptPO.setBankInfo("");
		salesReceiptPO.setCheckvBank("");
		salesReceiptPO.setCouponInfo("");
		salesReceiptPO.setComment("");
		salesReceiptPO.setRealMoney(salesPO.getTotal());

		salesReceiptDao.save(salesReceiptPO);

		SalesPaymentPO salesPaymentPO = new SalesPaymentPO(operater, salesPO);

		salesPaymentPO.setOrderId(salesPO.getOrderId());
		salesPaymentPO.setSalesReceipt(salesReceiptPO);

		salesPaymentPO.setType(SalesPaymentPO.TYPE_REPLENISHMENT_INT);
		salesPaymentPO.setStatus(SalesPaymentPO.STATUS_CONFIRMED_INT);
		salesPaymentPO.setCategory(salesPO.getCategory());
		salesPaymentPO.setBrand(salesPO.getBrand().getName());
		salesPaymentPO.setCreater(operater);
		salesPaymentPO.setCreateTime(current);
		salesPaymentPO.setReferMoney(Math.abs(salesPO.getTotal()));
		salesPaymentPO.setCompany(salesPO.getCompany());

		salesPaymentDao.save(salesPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int sendSales(SalesVO salesVO, String userId) throws FLException {

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		String orderId = salesPO.getOrderId();

		UserPO sender = userDao.queryUserByUserId(userId);

		System.out.println(String.format("pages/sales/sales?orderId=%s&sid=%s", salesPO.getOrderId(), salesPO.getSid()));

		decorationService.sendMessage(orderId, "装修单", String.format("品牌: %s, 金额: %s, 销售单信息确认. ", salesPO.getBrand().getName(), Arith.div(salesPO.getTotal(), 1000000)), String.format("pages/sales/sales?orderId=%s&sid=%s", salesPO.getOrderId(), salesPO.getSid()), sender);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmSales(SalesVO salesVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		SalesPO salesPO = salesDao.get(salesVO.getSid());

		if (salesPO == null) {
			throw new FLException(260021, "销售单不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(salesPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (salesVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			salesVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (salesVO.getCustomer().getPhone() != null && !decorationPO.getCustomer().getPhone().equals(SensitiveDataHelper.encrypt(salesVO.getCustomer().getPhone()))) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cusDecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cusDecorationVO.setOrderId(decorationPO.getOrderId());
		cusDecorationVO.setUnionId(salesVO.getCustomer().getNo());

		if (decorationService.queryDecoration(cusDecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		salesPO.setIsAffirm(SalesPO.ISAFFIRM_AFFIRM_INT);
		salesPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

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

		salesDao.update(salesPO);

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
