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
import com.fanglin.communion.dao.CityProperPartnerDao;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.dao.DepartmentDao;
import com.fanglin.communion.dao.DepartmentPartnerDao;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.CityProperPartnerPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.ServiceNodePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationMeasureRuleDao;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.data.po.DecorationMeasureRuleItemPO;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.DecorationServiceDao;
import com.fanglin.decoration.dao.DecorationUserDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.po.DecorationUserPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.AdvancePaymentDO;
import com.fanglin.payment.po.AdvancePaymentPO;
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
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.right.dao.DecorationDesignDepartmentRightDao;
import com.fanglin.right.dao.DecorationSalesmanDepartmentRightDao;
import com.fanglin.right.dao.DecorationStatusRightDao;
import com.fanglin.right.po.DecorationDesignDepartmentRightPO;
import com.fanglin.right.po.DecorationSalesmanDepartmentRightPO;
import com.fanglin.right.po.DecorationStatusRightPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

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
	private QuotationDao quotationDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private AdvancePaymentService advancePaymentService;

	@Autowired
	private DepartmentDao departmentDao;

	@Autowired
	private DepartmentPartnerDao departmentPartnerDao;

	@Autowired
	private CityProperPartnerDao cityProperPartnerDao;

	@Autowired
	private UserDao userDao;

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
	private DecorationUserDao decorationUserDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Autowired
	private DecorationMeasureRuleDao decorationMeasureRuleDao;

	@Autowired
	private PaymentTypeDao paymentTypeDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	public void pageDecoration(Paging paging, List<Filter> filters, Authentication authentication, List<Short> statuses, Short companyType) throws FLException {

		if (filters.size() == 0) return;

		if (statuses == null || statuses.size() == 0) return;

		String userId = authentication.getUserId();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		Integer company = (companyType == null || companyType == 0) ? null : authentication.getCompany();

		filters.add(new Filter("decoration.statuses", statuses, "in", Filter.RANGE_TYPE_SHORT_INT));

		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			decorationVOs.add(addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()))));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForGeneral(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

		if (userPO == null) return;

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForGeneral(paging, filters, authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {
			decorationVOs.add(addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()))));
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForCommon(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<Integer> designDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRight(userPO.getUid(), company);

		designDepartmentIds = new ArrayList<Integer>();

		for (DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO : decorationDesignDepartmentRightPOs) {
			designDepartmentIds.add(decorationDesignDepartmentRightPO.getDid());
		}

		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRight(userPO.getUid(), company);

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

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForCompany(Paging paging, List<Filter> filters, int company, List<Short> statuses) throws FLException {

		if (filters.size() == 0) return;

		if (statuses == null || statuses.size() == 0) return;

		filters.add(new Filter("decoration.statuses", statuses, "in", Filter.RANGE_TYPE_SHORT_INT));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForCompany(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {
			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO()));

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForGrade(Paging paging, List<Filter> filters, int company) throws FLException {

		if (filters.size() == 0) return;

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForGrade(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForCustomer(Paging paging, List<Filter> filters, String customerPhone) throws FLException {

		if (filters.size() == 0 && customerPhone == null) {
			return;
		}

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhone(SensitiveDataHelper.getAllEncryptedForms(customerPhone), CustomerPhonePO.STATUS_ENABLE_INT, null, null);

		filters.add(new Filter("decoration.customer.cid", (null != customerPhones && !customerPhones.isEmpty()) ? String.valueOf(customerPhones.get(0).getCid()) : "-1", "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForCompany(paging, filters, null);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForDesigner(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		filters.add(new Filter("decoration.designer.userId", userPO.getUserId(), "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForDesign(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForDesignerDept(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		if (filters.size() == 0) return;

		List<DepartmentPO> departmentPOs = departmentDao.queryDepartment(userPO.getDept().getDid());

		List<Integer> deptIds = Arrays.asList(userPO.getDept().getDid());

		for (DepartmentPO departmentPO : departmentPOs) {
			deptIds.add(departmentPO.getDid());
		}

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForDesignDept(paging, filters, deptIds, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setDiscount(decorationPO.getDiscount());
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForDesignerManager(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		if (filters.size() == 0) return;

		List<Integer> designDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRight(userPO.getUid(), company);

		designDepartmentIds = new ArrayList<Integer>();

		for (DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO : decorationDesignDepartmentRightPOs) {
			designDepartmentIds.add(decorationDesignDepartmentRightPO.getDid());
		}

		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRight(userPO.getUid(), company);

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

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setDiscount(decorationPO.getDiscount());
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForSalesman(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		filters.add(new Filter("decoration.salesman.userId", userPO.getUserId(), "eq"));

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForSalesman(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO()));

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForSalesmanDept(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		if (filters.size() == 0) return;

		List<DepartmentPO> departmentPOs = departmentDao.queryDepartment(userPO.getDept().getDid());

		List<Integer> deptIds = Arrays.asList(userPO.getDept().getDid());

		for (DepartmentPO departmentPO : departmentPOs) {
			deptIds.add(departmentPO.getDid());
		}

		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForSalesDept(paging, filters, deptIds);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForSalesmanManager(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		List<Integer> salesmanDepartmentIds = null;
		List<Short> statuses = null;

		List<DecorationSalesmanDepartmentRightPO> decoratoinOrderSalesmanDepartmentRightPOs = decorationSalesmanDepartmentRightDao.queryDecorationSalesmanDepartmentRight(userPO.getUid(), company);

		if (decoratoinOrderSalesmanDepartmentRightPOs.isEmpty()) return;

		salesmanDepartmentIds = new ArrayList<Integer>();

		for (DecorationSalesmanDepartmentRightPO decorationSalesmanDepartmentRightPO : decoratoinOrderSalesmanDepartmentRightPOs) {
			salesmanDepartmentIds.add(decorationSalesmanDepartmentRightPO.getDid());
		}

		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRight(userPO.getUid(), company);

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

		DecorationVO decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = addition(decorationPO.getAddition(), decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));

			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			decorationVO.setDiscount(decorationPO.getDiscount());

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForQuoter(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		filters.add(new Filter("decoration.quoter.userId", userPO.getUserId(), "eq"));

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
	public void pageDecorationForEscorter(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		filters.add(new Filter("decoration.escorter.userId", userPO.getUserId(), "eq"));

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
	public void pageDecorationForMaterialer(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) return;

		filters.add(new Filter("decoration.materialer.userId", userPO.getUserId(), "eq"));

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
	public void pageDecorationForBelong(Paging paging, List<Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());

		if (userPO == null) return;

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
	public List<DecorationVO> queryDecorationByCustomerId(DecorationVO decorationVO, Authentication authentication) {

		CustomerVO customerVO = decorationVO.getCustomer();

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(customerVO.getCid(), customerVO.getNo(), Arrays.asList(authentication.getCompany()));
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return decorationVOs;
	}

	@Override
	public List<DecorationVO> queryDecorationForReferByOrderId(DecorationVO decorationVO, Authentication authentication) {

		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();

		List<DecorationPO> refers = decorationInfoDao.queryDecorationForChanceRefer(decorationVO.getOrderId());

		for (DecorationPO decorationPO : refers) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO()).refer(DecorationInfoPO.REFERTYPE_REFER_INT));
		}

		refers = decorationInfoDao.queryDecorationForOriginRefer(decorationVO.getOrderId());

		for (DecorationPO decorationPO : refers) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO()).refer(DecorationInfoPO.REFERTYPE_REFER_INT));
		}

		refers = decorationInfoDao.queryDecorationForOrderRefer(decorationVO.getOrderId());

		for (DecorationPO decorationPO : refers) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO()).refer(DecorationInfoPO.REFERTYPE_REFER_INT));
		}

		refers = decorationInfoDao.queryDecorationForChanceReferd(decorationVO.getOrderId());

		for (DecorationPO decorationPO : refers) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO()).refer(DecorationInfoPO.REFERTYPE_REFERD_INT));
		}

		refers = decorationInfoDao.queryDecorationForOriginReferd(decorationVO.getOrderId());

		for (DecorationPO decorationPO : refers) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO()).refer(DecorationInfoPO.REFERTYPE_REFERD_INT));
		}

		refers = decorationInfoDao.queryDecorationForOrderReferd(decorationVO.getOrderId());

		for (DecorationPO decorationPO : refers) {
			decorationVOs.add(decorationPO.ptvcascade(new DecorationVO()).refer(DecorationInfoPO.REFERTYPE_REFERD_INT));
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
		decorationVO.setMaterialer(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		if (decorationPO.getCustomer() != null && decorationVO.getCustomer() != null) decorationVO.getCustomer().initBank(decorationPO.getCustomer());

		if (decorationVO.getOrderTotalPrice() == null || decorationVO.getOrderTotalPrice() == 0) {
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
		}

		if (decorationVO.getDesigner() != null && decorationPO.getDesigner() != null) decorationVO.getDesigner().setPhone(decorationPO.getDesigner().getPhone());
		if (decorationVO.getSupervisor() != null && decorationPO.getSupervisor() != null) decorationVO.getSupervisor().setPhone(decorationPO.getSupervisor().getPhone());

		addition(decorationPO.getAddition(), decorationVO);

		decorationVO.setDompany(CompanyServiceImpl.encode(decorationPO.getCompany()));
		decorationVO.setConpany(CompanyServiceImpl.encode(decorationPO.getConpany()));
		decorationVO.setBompany(CompanyServiceImpl.encode(decorationPO.getBompany()));

		return decorationVO;
	}

	@Override
	public DecorationVO queryDecorationByDoid(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByDoid(decorationVO.getDoid());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		DecorationVO resultDecorationVO = new DecorationVO();

		resultDecorationVO.setEscorter(new UserBaseVO());
		resultDecorationVO.setQuoter(new UserBaseVO());
		resultDecorationVO.setSupervisor(new UserBaseVO());
		resultDecorationVO.setMaterialer(new UserBaseVO());

		decorationPO.ptvcascade(resultDecorationVO);

		if (decorationPO.getCustomer() != null && resultDecorationVO.getCustomer() != null) resultDecorationVO.getCustomer().initBank(decorationPO.getCustomer());

		if (resultDecorationVO.getOrderTotalPrice() == null || resultDecorationVO.getOrderTotalPrice() == 0) {
			resultDecorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
		}

		if (resultDecorationVO.getDesigner() != null && decorationPO.getDesigner() != null) resultDecorationVO.getDesigner().setPhone(decorationPO.getDesigner().getPhone());
		if (resultDecorationVO.getSupervisor() != null && decorationPO.getSupervisor() != null) resultDecorationVO.getSupervisor().setPhone(decorationPO.getSupervisor().getPhone());

		addition(decorationPO.getAddition(), resultDecorationVO);

		resultDecorationVO.setDompany(CompanyServiceImpl.encode(decorationPO.getCompany()));
		resultDecorationVO.setConpany(CompanyServiceImpl.encode(decorationPO.getConpany()));
		resultDecorationVO.setBompany(CompanyServiceImpl.encode(decorationPO.getBompany()));

		return resultDecorationVO;
	}

	@Override
	public DecorationVO queryDecorationForCommonByOrderId(DecorationVO decorationVO, String userId) throws FLException {

		decorationVO = queryDecorationByOrderId(decorationVO.getOrderId());

		return decorationVO;
	}

	@Override
	public DecorationVO checkDecoration(DecorationVO decorationVO, Authentication authentication) throws FLException {

		long hid = decorationVO.getHouse().getHid();

		int company = authentication.getCompany();

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(hid, Arrays.asList(company));

		if (decorationPO == null) return new DecorationVO();

		decorationPO.ptvcascade(decorationVO);

		decorationVO.setDompany(CompanyServiceImpl.encode(decorationPO.getCompany()));

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

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionForDefault(company, decorationVO.getType(), QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT);

		if (quotationVersionPO == null) {
			quotationVersionPO = quotationVersionDao.queryQuotationVersionForDefault(company, QuotationVersionPO.TYPE_COMMON_INT, QuotationVersionPO.DEFAULTFLAG_DEFAULT_INT);
		}

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		decorationPO.setVersion(quotationVersionPO);

		String orderId = null;

		if (decorationVO.getOrderId() != null) {
			orderId = decorationVO.getOrderId();
			// 检查orderId是否已存在，如果存在则生成新的orderId
			DecorationPO existingOrder = decorationDao.queryDecorationByOrderId(orderId);
			if (existingOrder != null) {
				// orderId已存在，生成新的orderId
				String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
				int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);
				orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
			}
		} else {
			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

			orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		}

		decorationPO.setOrderId(orderId);
		decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
		decorationPO.setHouseClass(decorationVO.getHouseClass());
		decorationPO.setHouseType(decorationVO.getHouseType());
		decorationPO.setResourceType(decorationVO.getResourceType());// 量房0 资源1
		decorationPO.setBusitype(new DecorationBusitypePO(decorationVO.getBusitype()));
		decorationPO.setOrderTotalPrice(0);
		decorationPO.setPaySacle((short) 0);
		decorationPO.setGrade(decorationVO.getGrade());
		decorationPO.setStatus(DecorationPO.STATUS_INIT_INT);
		decorationPO.setCompany(company);

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

		if (decorationVO.getMaterialer() != null) {
			UserPO materialer = userDao.queryUserByUserId(decorationVO.getMaterialer().getUserId());
			decorationPO.setMaterialer(materialer);
		}

		if (decorationVO.getBompany() != null) {
			decorationPO.setBompany(CompanyServiceImpl.decode(decorationVO.getBompany()));
		} else {
			decorationPO.setBompany(company);
		}

		decorationPO.setDesigner(designer);
		decorationPO.setDesignDept(designer.getDept());
		decorationPO.setSalesman(salesman);
		decorationPO.setSalesDept(salesman.getDept());

		DepartmentPartnerPO departmentPartnerPO = departmentPartnerDao.queryDepartmentPartner(designer.getDept().getDid(), DepartmentPartnerPO.TYPE_DECO_INT);

		if (departmentPartnerPO != null && departmentPartnerPO.getPartner() != null) {
			decorationPO.setEscorter(departmentPartnerPO.getPartner());
		}

		DepartmentPartnerPO partnerSO = departmentPartnerDao.queryDepartmentPartner(designer.getDept().getDid(), DepartmentPartnerPO.TYPE_SALES_INT);

		if (partnerSO != null) {

			DecorationUserPO decorationUserPO = new DecorationUserPO();

			decorationUserPO.setOrderId(decorationPO.getOrderId());
			decorationUserPO.setUser(partnerSO.getPartner());
			decorationUserPO.setType(DecorationUserPO.TYPE_SALES_INT);

			decorationUserDao.save(decorationUserPO);
		}

		HousePO housePO = houseDao.get(decorationVO.getHouse().getHid());

		decorationPO.setHouse(housePO);

		CityProperPartnerPO partnerCPO = cityProperPartnerDao.queryCityProperPartner(housePO.getVillage().getCityProper().getCpid(), CityProperPartnerPO.TYPE_SALES_INT);

		if (partnerCPO != null) {

			DecorationUserPO decorationUserPO = new DecorationUserPO();

			decorationUserPO.setOrderId(decorationPO.getOrderId());
			decorationUserPO.setType(DecorationUserPO.TYPE_SALES_INT);
			decorationUserPO.setUser(partnerCPO.getPartner());

			decorationUserDao.save(decorationUserPO);
		}

		decorationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setMeasureTime(DateUtil.getDateToTimestamp(new Date()));

		UserPO operater = userDao.queryUserByUserId(userId);
		decorationPO.setCreater(operater);

		decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_INITIA_INT);
		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_INITIAL_INT);

		decorationPO.setOtherStatus(DecorationPO.STATUS_INIT_INT);
		decorationPO.setType(decorationVO.getType());
		decorationPO.setTypeness(decorationVO.getTypeness());

		decorationDao.save(decorationPO);
		decorationDao.flush();

		DecorationInfoPO decorationInfoPO = new DecorationInfoPO(orderId);

		if (decorationInfoVO != null) BeanUtil.copyPropertie(decorationInfoVO, decorationInfoPO);

		decorationInfoDao.save(decorationInfoPO);

		// 创建订单归属信息
		decorationBelongDao.save(new DecorationBelongPO().designer(orderId, designer, operater, decorationInfoVO.getCcid()));
		decorationBelongDao.save(new DecorationBelongPO().salesman(orderId, salesman, operater, decorationInfoVO.getCcid()));

		// 创建附加信息
		DecorationAdditionPO additionInfo = new DecorationAdditionPO();
		additionInfo.setOrderId(decorationPO.getOrderId());

		additionInfo.setDesign(decorationPO.getDesigner().getCurrentName(), decorationPO.getDesigner().getDept().getName(), decorationPO.getDesigner().getDept().getName());
		additionInfo.setSales(decorationPO.getSalesman().getCurrentName(), decorationPO.getSalesman().getDept().getName(), decorationPO.getSalesman().getDept().getFatherDept().getName());

		additionInfo.setIssueTime(decorationInfoVO.getIssueTime());
		additionInfo.setMeetTime(decorationInfoVO.getMeetTime());

		decorationAdditionDao.save(additionInfo); // 辅助信息

		advancePaymentDao.save(new AdvancePaymentDO(orderId));

		decorationOperateDao.save(new DecorationOperatePO().create(orderId, operater)); // 创建装修单操作信息

		decorationServiceDao.makeDecorationService(ServiceNodePO.SERVICE_TYPE_DECORTAION_INT, orderId, decorationPO.getDesigner().getUid()); // 服务节点

		auditDao.save(new AuditPO(decorationPO)); // 预算审核

		// 生成装修单创建事件
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "makeDecoration", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"DECORATION_CREATED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		decorationVO.setOrderId(decorationPO.getOrderId());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT, DecorationPO.STATUS_SIGNED_INT }); // 咨询,

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
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
			DecorationBusitypePO decorationBusitypePO = new DecorationBusitypePO();
			decorationBusitypePO.setDbid(decorationVO.getBusitype());
			decorationPO.setBusitype(decorationBusitypePO);
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

			messageQueuingDao.save(new MessageQueuingPO().init(orderId, "changeDecorationForAdvance", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"TEAM_PLAN_DESIGNER_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		}

		if (decorationVO.getMaterialer() != null) {
			UserPO materialer = userDao.queryUserByUserId(decorationVO.getMaterialer().getUserId());
			decorationPO.setMaterialer(materialer);
		}

		HousePO housePO = decorationPO.getHouse();

		if (decorationVO.getHouse() != null && decorationVO.getHouse().getBuildArea() != null) {
			housePO.setBuildArea(decorationVO.getHouse().getBuildArea());
			houseDao.update(housePO);
		}

		if (decorationVO.getHouse() != null && decorationVO.getHouse().getInnerArea() != null) {
			housePO.setInnerArea(decorationVO.getHouse().getInnerArea());
			houseDao.update(housePO);
		}

		decorationDao.update(decorationPO);

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "changeDecorationForAdvance", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_INFO_UPDATED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForCustomer(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		// 判断装修单是否存在
		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CustomerPO customerPO = customerDao.get(decorationVO.getCustomer().getCid());

		if (customerPO == null) {
			throw new FLException(130002, "客户不存在");
		}

		decorationPO.setCustomer(customerPO);
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

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单:%s房产修改,原房产:%s,修改房产为:%s.", orderId, oldHouse, newHouse)));
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
		decorationPaymentDao.changeDecorationPayment(oldOrderId, newOrderId);

		decorationDao.changeDecorationForOrderId(newOrderId, oldOrderId);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, oldOrderId, String.format("订单编号修改,原订单编号:%s,修改编号为:%s.", oldOrderId, newOrderId)));
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

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单:%s,类型为:%s,录入时间修改,原录入时间:%s,修改录入时间为:%s.", orderId, timeType == 1 ? "录入时间" : "签单时间", oldTime != null ? oldTime.toString() : "空", dateTime.toString())));
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

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByVersionId(versionId);

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		oldVersionId = decorationPO.getVersion().getNo();

		decorationPO.setVersion(quotationVersionPO);

		decorationDao.update(decorationPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单:%s,报价版本修改,原报价版本:%s,修改报价版本为:%s", orderId, oldVersionId, versionId)));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForPayScale(DecorationVO decorationVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationPO.setSaleScale(DecorationPO.TYPE_INIT_SALESCALE_INT);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, decorationVO.getOrderId(), String.format("装修单:%s, 销售配比忽略验证.", decorationVO.getOrderId())));

		decorationDao.update(decorationPO);
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

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "changeDecorationForStatus", "{\"orderId\":\"" + orderId + "\",\"status\":" + status + ",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单:%s状态修改,原状态:%s,修改状态为:%s.", orderId, oldStatus, status)));
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

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单:%s状态修改,原类型:%s,修改类型为:%s.", orderId, String.valueOf(oldType), String.valueOf(decorationVO.getType()))));
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

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(decorationPO.getOrderId(), "obsoleteDecoration", "{\"orderId\":\"" + decorationPO.getOrderId() + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(decorationPO.getOrderId(), "obsoleteDecoration", "{\"orderId\":\"" + decorationPO.getOrderId() + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void terminalDecoration(DecorationVO decorationVO, List<DecorationPaymentVO> decorationPaymentVOs, String userId, int company) throws FLException {

		long backup = 0;
		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		short status = decorationPO.getStatus();

		if (!Arrays.asList(DecorationPO.STATUS_PROSIGNTERMINABLE_INT, DecorationPO.STATUS_SIGNEDTERMINABLE_INT).contains(status)) {
			throw new FLException(140025, "订单非可终止状态,不能终止合同");
		}

		for (DecorationPaymentVO decorationPaymentVO : decorationPaymentVOs) {
			backup = Arith.add(backup, decorationPaymentVO.getReferMoney());
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		for (DecorationPaymentVO decorationPaymentVO : decorationPaymentVOs) {

			if (decorationPaymentVO.getReferMoney() == 0) {
				continue;
			}

			DecorationReceiptPO decorationReceiptPO = new DecorationReceiptPO();

			decorationReceiptPO.setCollecter(operater);
			decorationReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
			decorationReceiptPO.setAdvanceType(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT);
			decorationReceiptPO.setAdvance(decorationPaymentVO.getReferMoney());
			decorationReceiptPO.setComment(decorationPaymentVO.getPaymentType());

			decorationReceiptDao.save(decorationReceiptPO);

			DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();

			PaymentTypePO paymentTypePO = paymentTypeDao.queryPaymentTypeByName(decorationPaymentVO.getPaymentType(), company);

			decorationPaymentPO.setCreater(operater);
			decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationPaymentPO.setPtid(paymentTypePO.getPtid());
			decorationPaymentPO.setPaymentType(decorationPaymentVO.getPaymentType());
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
			decorationPaymentPO.setReferMoney(decorationPaymentVO.getReferMoney());
			decorationPaymentPO.setDecoration(decorationPO);
			decorationPaymentPO.setCompany(company);

			decorationPaymentPO.setDecorationReceipt(decorationReceiptPO);

			decorationPaymentDao.save(decorationPaymentPO);
		}

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

		long advancePaymentAmount = advancePaymentPO == null ? 0 : advancePaymentPO.getBalance();

		Short[] statuses = { PaymentPO.PAYMENT_STATUS_PAID_INT, PaymentPO.PAYMENT_STATUS_CONFIRMED_INT };

		long decorationPaymentAmount = decorationPaymentDao.amountDecorationPayment(orderId, statuses, PaymentPO.PAYMENT_TYPE_EXTRACT_INT, PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_INT);

		long amount = Arith.add(advancePaymentAmount, decorationPaymentAmount);

		if (backup > amount) {
			throw new FLException(150025, "款项金额不正确");
		}

		if (decorationPaymentAmount > 0) {

			long refund = Arith.sub(decorationPaymentAmount, backup);

			DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();

			PaymentTypePO paymentTypePO = paymentTypeDao.queryPaymentTypeByName(DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR, company);

			decorationPaymentPO.setCreater(operater);
			decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationPaymentPO.setPtid(paymentTypePO.getPtid());
			decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR);
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
			decorationPaymentPO.setReferMoney(refund < 0 ? 0 : refund);
			decorationPaymentPO.setDecoration(decorationPO);
			decorationPaymentPO.setCompany(company);

			decorationPaymentDao.save(decorationPaymentPO);
		}

		if (decorationPaymentAmount < backup) {

			long refund = Arith.sub(backup, decorationPaymentAmount);

			PaymentVO paymentVO = new PaymentVO();

			paymentVO.setOrderId(decorationPO.getOrderId());
			paymentVO.setCustomer(new CustomerVO(decorationPO.getCustomer().getCid()));
			paymentVO.setCollectUser(new UserBaseVO(userId));
			paymentVO.setTransfer(refund);
			paymentVO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_INT);
			paymentVO.setComment(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
			paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_INT);
			paymentVO.setPaymentType(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_INT);
			paymentVO.setUniqueid("D" + String.valueOf(new Date().getTime()));

			advancePaymentService.updateAdvancePayment(paymentVO, company);
		}

		decorationPO.setStatus(DecorationPO.STATUS_TERMINATION_INT);
		decorationPO.setTerminalTime(DateUtil.getDateToTimestamp(new Date()));
		decorationDao.update(decorationPO);

		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(decorationPO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		for (DecorationBelongPO decorationBelongPO : designers) {
			decorationOperateDao.save(new DecorationOperatePO().terminal(orderId, operater).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_DESIGN_INT, decorationBelongPO.getRate()));
		}

		for (DecorationBelongPO decorationBelongPO : salesmans) {
			decorationOperateDao.save(new DecorationOperatePO().terminal(orderId, operater).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_BUSINESS_INT, decorationBelongPO.getRate()));
		}

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "terminalDecoration", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "terminalDecoration", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
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
	public void tranDecoration(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, int company) throws FLException {

		// checkOverDecoration(decorationVO.getCustomer().getCid(), decorationVO.getHouse().getHid());
		checkOverDecoration(decorationVO.getCustomer().getCid(), decorationVO.getHouse().getHid(), company);

		makeDecoration(decorationVO, decorationInfoVO, decorationVO.getCreater().getUserId(), company);

		UserPO creater = null;
		HousePO housePO = null;

		if (decorationVO.getCreater() != null) {
			creater = userDao.queryUserByUserId(decorationVO.getCreater().getUserId());
		}

		if (decorationVO.getHouse().getHid() != null) {
			housePO = houseDao.get(decorationVO.getHouse().getHid());
		}

		String content = String.format("客源确认,装修单:%s,楼盘:%s,楼号:%s", decorationVO.getOrderId(), housePO.getVillage().getName(), housePO.getHouseNumber());

		messageService.sendMessage(creater.getUserId(), null, content, MessagePO.TYPE_SEND_CUSTOMER_INT, creater.getCompany());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationForAdvance(DecorationVO decorationVO, String userId) throws FLException {

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

			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

			if (quotationPO != null && quotationPO.getStatus() != QuotationPO.STATUS_INIT_INT) {
				throw new FLException(200033, "报价已锁定");
			}

			serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单: %s, 原非提: %s, 现非提: %s.", orderId, decorationPO.getNotSalesmanRate(), decorationVO.getNotSalesmanRate())));

			decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
		}

		if (type != null && typeness != null) {
			serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("装修单: %s, 原业务: %s, 现业务: %s.", orderId, decorationPO.getTypeness(), decorationVO.getTypeness())));

			decorationPO.setType(type);
			decorationPO.setTypeness(typeness);
		}

		decorationDao.update(decorationPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationForPayScale(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationAdditionService.updateDecorationForPayScale(decorationVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationForSaleScale(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationAdditionService.updateDecorationForSaleScale(decorationVO);
	}

	@Override
	public void checkOverDecoration(long cid, long hid) throws FLException {

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByHid(hid);

		for (DecorationPO decorationPO : decorationPOs) {

			if (!Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_WASTE_INT).contains(decorationPO.getStatus())) {
				throw new FLException(140063, String.format("装修单(%s)存在, 设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
			}
		}

		decorationPOs = decorationDao.queryDecorationByCustomerId(cid);

		for (DecorationPO decorationPO : decorationPOs) {

			if (!Arrays.asList(DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_WASTE_INT).contains(decorationPO.getStatus())) {
				throw new FLException(140063, String.format("装修单(%s)存在, 设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
			}
		}
	}

	@Override
	public void checkOverDecoration(long cid, long hid, int company) throws FLException {

		List<Integer> companys = new ArrayList<Integer>(Arrays.asList(company));

		List<DecorationMeasureRuleItemPO> measures = decorationMeasureRuleDao.queryDecorationMeasureRule(company);

		for (DecorationMeasureRuleItemPO measure : measures) {
			companys.add(measure.getCompany());
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(hid, companys);

		if (decorationPO != null) {
			throw new FLException(140063, String.format("装修单(%s)存在, 设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(cid, null, companys);

		if (decorationPOs.size() > 0) {
			decorationPO = decorationPOs.get(0);
			throw new FLException(140063, String.format("装修单(%s)存在, 设计师:%s", decorationPO.getOrderId(), decorationPO.getDesigner().getCurrentName()));
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void hiddenDecoration(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		// 自动切换：显示→隐藏，隐藏→显示
		short currentStatus = decorationPO.getOtherStatus();
		short newStatus = (currentStatus == DecorationPO.OTHERSTATUS_SHOW_INT) ? DecorationPO.OTHERSTATUS_HIDDEN_INT : DecorationPO.OTHERSTATUS_SHOW_INT;

		decorationPO.setOtherStatus(newStatus);
		decorationDao.update(decorationPO);

		// 记录操作历史
		UserPO operater = userDao.queryUserByUserId(userId);
		String comment = (newStatus == DecorationPO.OTHERSTATUS_HIDDEN_INT) ? "隐藏" : "显示";

		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();

		decorationOperatePO.setOrderId(orderId);
		decorationOperatePO.setOperater(operater);
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setType(DecorationOperatePO.TYPE_HIDDEN_DECORATION_ORDER_INT);
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setComment(comment);

		decorationOperateDao.save(decorationOperatePO);
	}

	private DecorationVO addition(DecorationAdditionPO addition, DecorationVO decorationVO) {

		if (addition == null) return decorationVO;

		if (decorationVO.getDesigner() != null && addition.getDesigner() != null) decorationVO.getDesigner().setCurrentName(addition.getDesigner());
		if (decorationVO.getSalesman() != null && addition.getSalesman() != null) decorationVO.getSalesman().setCurrentName(addition.getSalesman());
		if (decorationVO.getDesigner() != null && decorationVO.getDesigner().getDept() != null && addition.getDesignDepartment() != null) decorationVO.getDesigner().getDept().setName(addition.getDesignDepartment());
		if (decorationVO.getSalesman() != null && decorationVO.getSalesman().getDept() != null && addition.getSalesDepartment() != null) decorationVO.getSalesman().getDept().setName(addition.getSalesDepartment());
		if (decorationVO.getDesigner() != null && decorationVO.getDesigner().getDept() != null && decorationVO.getDesigner().getDept().getFatherDept() != null && addition.getDesignRegion() != null) decorationVO.getDesigner().getDept().getFatherDept().setName(addition.getDesignRegion());
		if (decorationVO.getSalesman() != null && decorationVO.getSalesman().getDept() != null && decorationVO.getSalesman().getDept().getFatherDept() != null && addition.getSalesRegion() != null) decorationVO.getSalesman().getDept().getFatherDept().setName(addition.getSalesRegion());

		return decorationVO;
	}

}
