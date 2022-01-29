/**
 * @File Name		: DecorationServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.ServiceNodePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.DecorationServiceDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.AdvancePaymentDO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.right.dao.DecorationDesignDepartmentRightDao;
import com.fanglin.right.dao.DecorationSalesmanDepartmentRightDao;
import com.fanglin.right.dao.DecorationStatusRightDao;
import com.fanglin.right.po.DecorationDesignDepartmentRightPO;
import com.fanglin.right.po.DecorationSalesmanDepartmentRightPO;
import com.fanglin.right.po.DecorationStatusRightPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("decorationServiceO")
@Transactional(readOnly = true)
public class DecorationServiceImpl implements DecorationService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private AdvancePaymentService advancePaymentService;

	@Autowired
	private UserDao userDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private ServiceRecordDao serviceRecordDao;

	@Autowired
	private DecorationServiceDao decorationServiceDao;

	@Autowired
	private DecorationOperateDao decorationOperateDao;

	@Autowired
	private DecorationDesignDepartmentRightDao decorationDesignDepartmentRightDao;

	@Autowired
	private DecorationSalesmanDepartmentRightDao decorationSalesmanDepartmentRightDao;

	@Autowired
	private DecorationStatusRightDao decorationStatusRightDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private AuditDao auditDao;

	@Autowired
	private DecorationReceiptDao decorationReceiptDao;

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Override
	public void pageDecoration(Paging paging, List<Filter> filters, Authentication authentication, List<Short> statuses) {

		if (filters.size() == 0)
			return;

		if (statuses == null || statuses.size() == 0)
			return;

		String userId = authentication.getUserId();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		filters.add(new Filter("statuses", statuses, "in"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationVO.setEscorter(new UserBaseVO());
			decorationVO.setQuoter(new UserBaseVO());

			decorationPO.ptvcascade(decorationVO);

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForGeneral(Paging paging, List<Filter> filters, Authentication authentication) {

		if (filters.size() == 0)
			return;

		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

		if (userPO == null)
			return;

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForGeneral(paging, filters, authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationVO.setEscorter(new UserBaseVO());
			decorationVO.setQuoter(new UserBaseVO());

			decorationPO.ptvcascade(decorationVO);

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForCommon(Paging paging, List<Filter> filters, Authentication authentication) {

		if (filters.size() == 0)
			return;

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		List<Integer> designDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRightByUId(userPO.getUid(), company);

		designDepartmentIds = new ArrayList<Integer>();

		for (DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO : decorationDesignDepartmentRightPOs) {
			designDepartmentIds.add(decorationDesignDepartmentRightPO.getDid());
		}

		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(), company);

		statuses = new ArrayList<Short>();

		for (DecorationStatusRightPO decorationStatusRightPO : decorationStatusRightPOs) {
			statuses.add(decorationStatusRightPO.getStatus());
		}

		if (statuses.size() == 0 || designDepartmentIds.size() == 0) {
			return;
		}

		if (designDepartmentIds.size() == 1 && designDepartmentIds.get(0) == DecorationDesignDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT) {
			designDepartmentIds = null;
		}

		if (statuses.size() == 1 && DecorationStatusRightPO.STATUS_ALL_ENABLE_INT == statuses.get(0)) {
			statuses = null;
		}

		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, designDepartmentIds, statuses, authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationPO.ptvcascade(decorationVO);

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForCompany(Paging paging, List<Filter> filters, int company, List<Short> statuses) {

		if (filters.size() == 0)
			return;

		if (statuses == null || statuses.size() == 0)
			return;

		filters.add(new Filter("statuses", statuses, "in"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForCompany(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationPO.ptvcascade(decorationVO);

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForGrade(Paging paging, List<Filter> filters, int company) {

		if (filters.size() == 0)
			return;

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForGrade(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForCustomer(Paging paging, List<Filter> filters, String customerPhone, int company) {

		if (filters.size() == 0 && customerPhone == null) {
			return;
		}

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByPhone(customerPhone, CustomerPhonePO.STATUS_ENABLE_INT, company);

		filters.add(new Filter("customercid", (null != customerPhones && !customerPhones.isEmpty()) ? String.valueOf(customerPhones.get(0).getCid()) : "-1", "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForCompany(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForDesigner(Paging paging, List<Filter> filters, Authentication authentication) {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		filters.add(new Filter("designerId", userPO.getUserId(), "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForDesign(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForSalesman(Paging paging, List<Filter> filters, Authentication authentication) {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		filters.add(new Filter("salesmanId", userPO.getUserId(), "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForSalesman(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationPO.ptvcascade(decorationVO);

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForBelong(Paging paging, List<Filter> filters, Authentication authentication) {

		if (filters.size() == 0)
			return;

		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

		if (userPO == null)
			return;

		List<Short> statuses = Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT);

		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, null, statuses, authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationPO.ptvcascade(decorationVO);

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForQuoter(Paging paging, List<Filter> filters, Authentication authentication) {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		filters.add(new Filter("quoterId", userPO.getUserId(), "eq"));

		List<Integer> designDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationPO.ptvcascade(decorationVO);

			if (decorationPO.getOrderTotalPrice() != 0) {
				decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			} else {
				decorationVO.setOrderTotalPrice(0L);
			}

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForEscorter(Paging paging, List<Filter> filters, Authentication authentication) {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		filters.add(new Filter("escorterId", userPO.getUserId(), "eq"));

		List<Integer> designDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationPO.ptvcascade(decorationVO);

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForDesignerManager(Paging paging, List<Filter> filters, Authentication authentication) {
		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		if (filters.size() == 0)
			return;

		List<Integer> designDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRightByUId(userPO.getUid(), company);

		designDepartmentIds = new ArrayList<Integer>();

		for (DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO : decorationDesignDepartmentRightPOs) {
			designDepartmentIds.add(decorationDesignDepartmentRightPO.getDid());
		}

		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(), company);

		statuses = new ArrayList<Short>();

		for (DecorationStatusRightPO decorationStatusRightPO : decorationStatusRightPOs) {
			statuses.add(decorationStatusRightPO.getStatus());
		}

		if (statuses.size() == 0 || designDepartmentIds.size() == 0) {
			return;
		}

		if (designDepartmentIds.size() == 1 && designDepartmentIds.get(0) == DecorationDesignDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT) {
			designDepartmentIds = null;
		}

		if (statuses.size() == 1 && DecorationStatusRightPO.STATUS_ALL_ENABLE_INT == statuses.get(0)) {
			statuses = null;
		}

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForDesignerManager(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, Authentication authentication) {
		if (filters.size() == 0)
			return;

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return;

		List<Integer> salesmanDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationSalesmanDepartmentRightPO> decoratoinOrderSalesmanDepartmentRightPOs = decorationSalesmanDepartmentRightDao.queryDecorationSalesmanDepartmentRightByUId(userPO.getUid(), company);

		if (decoratoinOrderSalesmanDepartmentRightPOs.isEmpty())
			return;

		salesmanDepartmentIds = new ArrayList<Integer>();

		for (DecorationSalesmanDepartmentRightPO decorationSalesmanDepartmentRightPO : decoratoinOrderSalesmanDepartmentRightPOs) {
			salesmanDepartmentIds.add(decorationSalesmanDepartmentRightPO.getDid());
		}

		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(), company);

		statuses = new ArrayList<Short>();

		for (DecorationStatusRightPO decorationStatusRightPO : decorationStatusRightPOs) {
			statuses.add(decorationStatusRightPO.getStatus());
		}

		if (statuses.size() == 0 || salesmanDepartmentIds.size() == 0) {
			return;
		}

		if (salesmanDepartmentIds.size() == 1 && salesmanDepartmentIds.get(0) == DecorationSalesmanDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT) {
			salesmanDepartmentIds = null;
		}

		if (statuses.size() == 1 && DecorationStatusRightPO.STATUS_ALL_ENABLE_INT == statuses.get(0)) {
			statuses = null;
		}

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForSalesmanManager(paging, filters, salesmanDepartmentIds, statuses);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			DecorationVO decorationVO = new DecorationVO();

			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());

			decorationVO.setDiscount(decorationPO.getDiscount());

			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public List<DecorationVO> queryDecorationByCustomerId(DecorationVO decorationVO, Authentication authentication) {

		CustomerVO customerVO = decorationVO.getCustomer();

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(customerVO.getCid(), customerVO.getNo(), authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = new DecorationVO();
			decorationVO.setEscorter(new UserBaseVO());
			decorationVO.setQuoter(new UserBaseVO());
			decorationVO.setSupervisor(new UserBaseVO());

			decorationPO.ptvcascade(decorationVO);

			decorationVOs.add(decorationVO);
		}

		return decorationVOs;
	}

	@Override
	public DecorationVO queryDecorationByOrderId(String orderId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setEscorter(new UserBaseVO());
		decorationVO.setQuoter(new UserBaseVO());
		decorationVO.setSupervisor(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		if (decorationVO.getOrderTotalPrice() == null || decorationVO.getOrderTotalPrice() == 0) {
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
		}

		addition(decorationPO.getAddition(), decorationVO);

		try {
			decorationVO.setDompany(AESHelper.encrypt(FormatUtil.encodeCompany(decorationPO.getCompany()), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
		} catch (Exception e) {
			throw new FLException(230015, "公司不存在");
		}

		return decorationVO;
	}

	@Override
	public DecorationVO queryDecorationForCommonByOrderId(DecorationVO decorationVO, String userId) throws FLException {

		List<Short> unstatus = Arrays.asList(new Short[] { DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_TERMINATION_INT, DecorationPO.STATUS_COMPLETED_INT });

		decorationVO = queryDecorationByOrderId(decorationVO.getOrderId());

		Short status = decorationVO.getStatus();

		if (!unstatus.contains(status)) {

			UserPO userPO = userDao.queryUserByUserId(userId);

			if (userPO != null && !userPO.getDept().getName().contains("客服")) {
				decorationVO.getCustomer().setConfidentialInfo();
			}
		}

		return decorationVO;
	}

	@Override
	public DecorationVO checkDecoration(DecorationVO decorationVO, Authentication authentication) {

		long hid = decorationVO.getHouse().getHid();

		int company = authentication.getCompany();

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(hid, company);

		if (decorationPO == null)
			return new DecorationVO();

		decorationPO.ptvcascade(decorationVO);

		return decorationVO;
	}

	@Override
	public void checkDecorationForExist(DecorationVO decorationVO) {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO != null) {
			decorationPO.ptvcascade(decorationVO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void createDecoration(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId, int company) throws FLException {

		checkOverDecoration(decorationVO.getCustomer().getCid(), decorationVO.getHouse().getHid(), company);

		makeDecoration(decorationVO, decorationInfoVO, userId, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void createDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId, int company) throws FLException {
		makeDecoration(decorationVO, decorationInfoVO, userId, company);
	}

	private void makeDecoration(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		DecorationPO decorationPO = new DecorationPO();

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionForDefault(company);

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		decorationPO.setVersion(quotationVersionPO);

		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

		String orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		decorationPO.setOrderId(orderId);
		decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
		decorationPO.setHouseClass(decorationVO.getHouseClass());
		decorationPO.setHouseType(decorationVO.getHouseType());
		decorationPO.setStatus(DecorationPO.STATUS_INIT_INT);
		decorationPO.setResourceType(decorationVO.getResourceType());// 量房0 资源1
		decorationPO.setOrderTotalPrice(0);
		decorationPO.setBusitype(decorationVO.getBusitype());
		decorationPO.setCompany(company);
		decorationPO.setPaySacle((short) 0);
		decorationPO.setGrade(decorationVO.getGrade());

		decorationPO.setCustomer(new CustomerPO(decorationVO.getCustomer().getCid()));
		decorationPO.setHouse(new HousePO(decorationVO.getHouse().getHid()));

		UserPO designer = userDao.queryUserByUserId(decorationVO.getDesigner().getUserId());
		UserPO salesman = userDao.queryUserByUserId(decorationVO.getSalesman().getUserId());

		if (decorationVO.getQuoter() != null) {
			UserPO quoter = userDao.queryUserByUserId(decorationVO.getQuoter().getUserId());
			decorationPO.setQuoter(quoter);
		}

		if (decorationVO.getEscorter() != null) {
			UserPO escorter = userDao.queryUserByUserId(decorationVO.getEscorter().getUserId());
			decorationPO.setEscorter(escorter);
		}

		decorationPO.setDesigner(designer);
		decorationPO.setSalesman(salesman);

		decorationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setMeasureTime(DateUtil.getDateToTimestamp(new Date()));

		UserPO operater = userDao.queryUserByUserId(userId);
		decorationPO.setCreater(operater);

		decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_INITIA_INT);
		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_INITIAL_INT);

		decorationPO.setOtherStatus(0);
		decorationPO.setType(decorationVO.getType());
		decorationPO.setTypeness(decorationVO.getTypeness());

		decorationPO.setHouse(new HousePO(decorationVO.getHouse().getHid()));

		decorationDao.save(decorationPO);
		decorationDao.flush();

		DecorationInfoPO decorationInfo = new DecorationInfoPO(orderId);

		if (decorationInfoVO != null)
			BeanUtil.copyPropertie(decorationInfoVO, decorationInfo);

		decorationInfoDao.save(decorationInfo);

		// 创建订单归属信息
		decorationBelongDao.save(new DecorationBelongPO().designer(orderId, designer, operater));
		decorationBelongDao.save(new DecorationBelongPO().salesman(orderId, salesman, operater));

		// 创建附加信息
		DecorationAdditionPO additionInfo = new DecorationAdditionPO();
		additionInfo.setOrderId(decorationPO.getOrderId());

		additionInfo.setDesign(decorationPO.getDesigner().getCurrentName(), decorationPO.getDesigner().getDept().getName(), decorationPO.getDesigner().getDept().getName());
		additionInfo.setSales(decorationPO.getSalesman().getCurrentName(), decorationPO.getSalesman().getDept().getName(), decorationPO.getSalesman().getDept().getFatherDept().getName());

		decorationAdditionDao.save(additionInfo); // 辅助信息

		advancePaymentDao.save(new AdvancePaymentDO(orderId));

		decorationOperateDao.save(new DecorationOperatePO().create(orderId, operater)); // 创建装修单操作信息

		decorationServiceDao.makeDecorationService(ServiceNodePO.SERVICE_TYPE_DECORTAION_INT, orderId, decorationPO.getDesigner().getUid()); // 服务节点

		auditDao.save(new AuditPO(decorationPO)); // 预算审核

		decorationVO.setOrderId(decorationPO.getOrderId());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();
		Short type = decorationVO.getType();
		Short typeness = decorationVO.getTypeness();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT, DecorationPO.STATUS_SIGNED_INT }); // 咨询,

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		if (decorationVO.getNotSalesmanRate() != null) {
			decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
			serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("装修单:%s,非业务提点修改: %d", orderId, decorationVO.getNotSalesmanRate())));
		}

		if (decorationVO.getGrade() != null) {
			decorationPO.setGrade(decorationVO.getGrade());
		}

		if (decorationVO.getHouseType() != null) {
			decorationPO.setHouseType(decorationVO.getHouseType());
		}

		if (decorationVO.getHouseClass() != null) {
			decorationPO.setHouseClass(decorationVO.getHouseClass());
		}

		if (decorationVO.getBusitype() != null) {
			decorationPO.setBusitype(decorationVO.getBusitype());
		}

		if (type != null) {
			decorationPO.setType(type);
		}

		if (typeness != null) {
			decorationPO.setTypeness(typeness);
		}

		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(orderId);

		if (decorationInfoPO == null) {
			decorationInfoPO = new DecorationInfoPO(orderId);
		}

		BeanUtil.copyPropertie(decorationInfoVO, decorationInfoPO);

		decorationInfoDao.saveOrUpdate(decorationInfoPO);

		if (decorationVO.getQuoter() != null) {
			UserPO quoter = userDao.queryUserByUserId(decorationVO.getQuoter().getUserId());
			decorationPO.setQuoter(quoter);
		}

		if (decorationVO.getEscorter() != null) {
			UserPO escorter = userDao.queryUserByUserId(decorationVO.getEscorter().getUserId());
			decorationPO.setEscorter(escorter);
		}

		decorationDao.update(decorationPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForHouse(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		String oldHouse = String.format("%d %s %s", decorationPO.getHouse().getHid(), decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber());

		HousePO housePO = houseDao.get(decorationVO.getHouse().getHid());

		if (housePO == null) {
			throw new FLException(320002, "房产不存在");
		}

		decorationPO.setHouse(housePO);

		String newHouse = String.format("%d %s %s", housePO.getHid(), housePO.getVillage().getName(), housePO.getHouseNumber());

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("装修单:%s房产修改,原房产:%s,修改房产为:%s.", orderId, oldHouse, newHouse)));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForOrderId(String oldOrderId, String newOrderId, String userId) throws FLException {

		DecorationPO decorationPO;

		decorationPO = decorationDao.queryDecorationByOrderId(newOrderId);

		if (decorationPO != null) {
			throw new FLException(140010, "订单编号已经存在");
		}

		decorationPO = decorationDao.queryDecorationByOrderId(oldOrderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationBelongDao.changeDecorationBelongForOrderId(newOrderId, oldOrderId);
		decorationPaymentDao.changeDecorationPaymentForOrderId(oldOrderId, newOrderId);

		decorationDao.changeDecorationForOrderId(newOrderId, oldOrderId);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("订单编号修改,原订单编号:%s,修改编号为:%s.", oldOrderId, newOrderId)));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForTime(DecorationVO decorationVO, int timeType, Timestamp dateTime, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		Timestamp oldTime = null;

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		switch (timeType) {
		case 1:
			oldTime = decorationPO.getMeasureTime();
			decorationPO.setMeasureTime(dateTime);
			break;
		case 2:
			oldTime = decorationPO.getContractTime();
			decorationPO.setContractTime(dateTime);
			break;
		case 3:
			oldTime = decorationPO.getPrecontractTime();
			decorationPO.setPrecontractTime(dateTime);
			break;

		}

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("装修单:%s,类型为:%s,录入时间修改,原录入时间:%s,修改录入时间为:%s.", orderId, timeType == 1 ? "录入时间" : "签单时间", oldTime != null ? oldTime.toString() : "空", dateTime.toString())));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForVersionId(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();
		String versionId = decorationVO.getVersion().getNo();

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		String oldVersionId = "";
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		oldVersionId = decorationPO.getVersion().getNo();

		decorationPO.setVersion(new QuotationVersionPO(versionId));

		List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(orderId);

		for (QuotationPO quotationPO : quotationPOs) {
			List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid());

			for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

				String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());
				quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(tableName, quotationFunctionAreaPO.getQfaId());

				quotationFunctionAreaDao.delete(quotationFunctionAreaPO);
			}

			quotationDao.delete(quotationPO);
		}

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("装修单:%s,报价版本修改,原报价版本:%s,修改报价版本为:%s", orderId, oldVersionId, versionId)));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForStatus(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();
		Short status = decorationVO.getStatus();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		Short oldStatus = decorationPO.getStatus();

		decorationPO.setStatus(status);

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("装修单:%s状态修改,原状态:%s,修改状态为:%s.", orderId, oldStatus, status)));
	}

	@Override
	public void changeDecorationForType(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		short oldType = decorationPO.getType();

		decorationPO.setType(decorationVO.getType());

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, String.format("装修单:%s状态修改,原类型:%s,修改类型为:%s.", orderId, String.valueOf(oldType), String.valueOf(decorationVO.getType()))));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void obsoleteDecoration(DecorationVO decorationVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		Short status = decorationPO.getStatus();

		if (DecorationPO.STATUS_WASTE_INT == status) { // 废单
			throw new FLException(140021, "订单已处于废单状态");
		}

		if (DecorationPO.STATUS_SIGNED_INT == status) { // 签约
			throw new FLException(140022, "订单已签约,不可废单");
		}

		if (DecorationPO.STATUS_COMPLETED_INT == status) { // 完工
			throw new FLException(140023, "订单已完工,不可废单");
		}

		if (DecorationPO.STATUS_TERMINATION_INT == status) { // 终止
			throw new FLException(140024, "订单合同终止,不可废单");
		}

		if (DecorationPO.STATUS_RESIGNED_INT == status) {
			throw new FLException(140026, "订单重新签约,不能终止合同"); // 重新签约
		}

		decorationPO.setStatus(DecorationPO.STATUS_WASTE_INT);

		decorationDao.update(decorationPO);

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationOperateDao.save(new DecorationOperatePO().obsolete(decorationPO.getOrderId(), operater));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void terminalDecoration(DecorationVO decorationVO, List<DecorationPaymentVO> decorationPaymentVOs, Authentication authentication) throws FLException {

		long backup = 0;
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		for (DecorationPaymentVO decorationPaymentVO : decorationPaymentVOs) {
			backup = Arith.add(backup, decorationPaymentVO.getReferMoney());
		}

		if (DecorationPO.STATUS_PROSIGN_INT == decorationPO.getStatus()) {

			if (backup > decorationPO.getPrecontractPrice()) {
				throw new FLException(150025, "款项金额不正确");
			}

			if (backup != 0) {

				DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

				decorationReceiptPO.setCollecter(operater);
				decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
				decorationReceiptPO.setComment(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
				decorationReceiptPO.setAdvanceType(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT);
				decorationReceiptPO.setAdvance(backup);

				decorationReceiptDao.save(decorationReceiptPO);

				for (DecorationPaymentVO decorationPaymentVO : decorationPaymentVOs) {

					if (decorationPaymentVO.getReferMoney() == 0 ) {
						continue;
					}

					DecorationPaymentPO backupPaymentPO = new DecorationPaymentPO();

					backupPaymentPO.setCreater(operater);
					backupPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					backupPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
					backupPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
					backupPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
					backupPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
					backupPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
					backupPaymentPO.setDecoration(decorationPO);
					backupPaymentPO.setDecorationReceipt(decorationReceiptPO);
					backupPaymentPO.setCompany(company);

					decorationPaymentDao.save(backupPaymentPO);
				}

				PaymentVO paymentVO = new PaymentVO();

				paymentVO.setOrderId(decorationPO.getOrderId());
				paymentVO.setCustomer(new CustomerVO(decorationPO.getCustomer().getCid()));
				paymentVO.setCollectUser(new UserBaseVO(userId));
				paymentVO.setTransfer(backup);
				paymentVO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
				paymentVO.setComment(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
				paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_INT);
				paymentVO.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT);
				paymentVO.setUniqueid("D" + String.valueOf(new Date().getTime()));

				advancePaymentService.updateAdvancePayment(paymentVO, company);
			}

		} else if (decorationPO.getStatus() == DecorationPO.STATUS_SIGNED_INT) {

			Short[] status = { PaymentPO.PAYMENT_STATUS_PAID_INT, PaymentPO.PAYMENT_STATUS_CONFIRMED_INT };
			long amount = decorationPaymentDao.amountDecorationPayment(decorationVO.getOrderId(), status, PaymentPO.PAYMENT_TYPE_EXTRACT_INT, PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_INT);
			long refund = Arith.sub(amount, backup);

			if (refund > amount) {
				throw new FLException(150025, "款项金额不正确");
			}

			if (backup != 0) {

				DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

				decorationReceiptPO.setCollecter(operater);
				decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
				decorationReceiptPO.setComment(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);

				decorationReceiptDao.save(decorationReceiptPO);

				for (DecorationPaymentVO decorationPaymentVO : decorationPaymentVOs) {

					if (decorationPaymentVO.getReferMoney() == 0 ) {
						continue;
					}

					DecorationPaymentPO backupPaymentPO = new DecorationPaymentPO();

					backupPaymentPO.setCreater(operater);
					backupPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					backupPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
					backupPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
					backupPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
					backupPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
					backupPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
					backupPaymentPO.setDecoration(decorationPO);
					backupPaymentPO.setDecorationReceipt(decorationReceiptPO);
					backupPaymentPO.setCompany(company);

					decorationPaymentDao.save(backupPaymentPO);
				}

			}

			DecorationPaymentPO refundPaymentPO = new DecorationPaymentPO();

			refundPaymentPO.setCreater(operater);
			refundPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			refundPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR);
			refundPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
			refundPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			refundPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
			refundPaymentPO.setReferMoney(refund);
			refundPaymentPO.setDecoration(decorationPO);
			refundPaymentPO.setCompany(company);

			decorationPaymentDao.save(refundPaymentPO);

		} else if (DecorationPO.STATUS_SIGNED_INT != decorationPO.getStatus()) {
			throw new FLException(140025, "订单非签约,不能终止合同");
		}

		decorationPO.setStatus(DecorationPO.STATUS_TERMINATION_INT);
		decorationDao.update(decorationPO);

		decorationOperateDao.save(new DecorationOperatePO().terminal(decorationPO.getOrderId(), operater));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void subDecorationForQuotationTime(DecorationVO decorationVO, String userId) throws FLException {

		DecorationPO DecorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (DecorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (DecorationPO.getQuotationTimeLimit() > 0) {
			DecorationPO.setQuotationTimeLimit(DecorationPO.getQuotationTimeLimit() - 1);

			decorationDao.update(DecorationPO);

			UserPO operater = userDao.queryUserByUserId(userId);

			decorationOperateDao.save(new DecorationOperatePO().subnum(DecorationPO.getOrderId(), operater));
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void tranDecorationFromCustomerOrigin(DecorationVO decorationVO, long csid, int company) throws FLException {

		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);

		// 判断客源信息是否存在
		if (customerOriginPO == null) {
			throw new FLException(330001, "客源不存在");
		}

		UserPO operater = customerOriginPO.getCreater();

		if (operater == null) {
			throw new FLException(190005, "人员不存在");
		}

		checkOverDecoration(customerOriginPO.getCustomer().getCid(), customerOriginPO.getHouse().getHid(), company);

		makeDecoration(decorationVO, null, operater.getUserId(), company);

		customerOriginPO.setOrderId(decorationVO.getOrderId());
		customerOriginPO.setStatus(CustomerOriginPO.STATUS_BIND_INT);

		customerOriginDao.update(customerOriginPO);
	}

	public void checkOverDecoration(long cid, long hid, int company) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(hid, company);

		if (decorationPO != null) {
			throw new FLException(140063, String.format("装修单存在,装修单号:%s,设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(cid, null, company);

		if (decorationPOs.size() > 0) {
			decorationPO = decorationPOs.get(0);
			throw new FLException(140063, String.format("装修单存在,装修单号:%s,设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
		}
	}

	private void addition(DecorationAdditionPO addition, DecorationVO decorationVO) {

		if (addition != null) {
			decorationVO.getDesigner().setCurrentName(addition.getDesigner());
			decorationVO.getSalesman().setCurrentName(addition.getSalesman());
			decorationVO.getDesigner().getDept().setName(addition.getDesignDepartment());
			decorationVO.getSalesman().getDept().setName(addition.getSalesDepartment());
			decorationVO.getDesigner().getDept().getFatherDept().setName(addition.getDesignRegion());
			decorationVO.getSalesman().getDept().getFatherDept().setName(addition.getSalesRegion());
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForRepairStatus(DecorationVO decorationVO) throws FLException {

		DecorationPO decoration = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decoration != null) {

			decoration.setRepairStatus(decorationVO.getRepairStatus());
			decorationDao.update(decoration);
		}

	}
}
