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
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.dao.ServiceNodeDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.ServiceNodePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
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
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.decoration.service.DecorationService;
import com.fanglin.decoration.vo.DecorationInfoVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.DecorationReceiptDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
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
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("quotationOrderService")
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
	private ServiceNodeDao serviceNodeDao;

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
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private CustomerOriginDao customerOriginDao;

	@Override
	public void pageDecoration(Paging paging, List<Filter> filters, Authentication authentication, List<Short> statuses) {

		if (filters.size() == 0)
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
			decorationVO.setOrderId(decorationPO.getOrderId());
			decorationVO.setStatus(decorationPO.getStatus());

			HousePO housePO = houseDao.get(decorationPO.getHouse().getHid());
			HouseVO houseVO = new HouseVO();
			VillageVO villageVO = new VillageVO();
			villageVO.setName(housePO.getVillage().getName());
			houseVO.setBuildArea(housePO.getBuildArea());
			houseVO.setVillage(villageVO);
			decorationVO.setHouse(houseVO);
			
			UserBaseVO duserBaseVO = new UserBaseVO();
			DepartmentVO ddepartmentVO = new DepartmentVO();
			ddepartmentVO.setName(decorationPO.getAddition().getDesignDepartment());
			duserBaseVO.setDept(ddepartmentVO);
			duserBaseVO.setCurrentName(decorationPO.getDesigner().getUserName());
			decorationVO.setDesigner(duserBaseVO);

			UserBaseVO suserBaseVO = new UserBaseVO();
			DepartmentVO sdepartmentVO = new DepartmentVO();
			sdepartmentVO.setName(decorationPO.getAddition().getSalesDepartment());
			suserBaseVO.setDept(sdepartmentVO);
			suserBaseVO.setCurrentName(decorationPO.getSalesman().getUserName());
			decorationVO.setSalesman(suserBaseVO);
			
			decorationPO.ptvcascade(decorationVO);
			
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
				decorationVO.setOrderTotalPrice(0f);
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
	public DecorationVO checkDecoration(Paging paging, List<Filter> filters, Authentication authentication) {

		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		DecorationVO decorationVO = new DecorationVO();

		if (filters.size() == 0)
			return decorationVO;

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null)
			return decorationVO;

		if (paging == null) {
			paging = new Paging(1, 10);
		}

		List<DecorationPO> decorationPOs = decorationDao.checkDeoration(paging, filters, company);

		if (decorationPOs.isEmpty())
			return decorationVO;

		for (DecorationPO decorationPO : decorationPOs) {

			decorationVO = new DecorationVO();

			decorationVO.setOrderId(decorationPO.getOrderId());
			
			decorationPO.ptvcascade(decorationVO);
			
			addition(decorationPO.getAddition(), decorationVO);

			decorationVOs.add(decorationVO);
		}

		paging.setData(decorationVOs);

		return decorationVOs.get(0);
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

		CompanyPO companyPO = companyDao.get(company);

		if (checkOverDecoration(decorationVO.getHouse().getHid(), company) != null) {
			throw new FLException(140034, "订单楼盘,楼号已存在");
		}

		DecorationPO decorationPO = new DecorationPO();

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByDefaultFlag(company, 1).get(0);
		decorationPO.setVersion(quotationVersionPO);

		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate, company);

		String orderId = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		decorationPO.setOrderId(orderId);

		if (decorationVO.getNotSalesmanRate() == null || decorationVO.getNotSalesmanRate() > 1 || decorationVO.getNotSalesmanRate() < 0) {
			decorationPO.setNotSalesmanRate((float) 0);
		} else {
			decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
		}

		decorationPO.setHouseClass(decorationVO.getHouseClass());
		decorationPO.setHouseType(decorationVO.getHouseType());
		decorationPO.setStatus(DecorationPO.STATUS_INIT_INT);
		decorationPO.setResourceType(decorationVO.getResourceType());// 量房0 资源1
		decorationPO.setOrderTotalPrice(0f);
		decorationPO.setSalesmanType(decorationVO.getSalesmanType());
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

		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_INITIAL_INT);

		decorationPO.setOtherStatus(0);
		decorationPO.setType(decorationVO.getType());

		decorationPO.setHouse(new HousePO(decorationVO.getHouse().getHid()));

		decorationDao.save(decorationPO);

		DecorationInfoPO decorationInfo = new DecorationInfoPO();

		if(decorationInfoVO != null) BeanUtil.copyPropertie(decorationInfoVO, decorationInfo);
		decorationInfo.setOrderId(orderId);

		decorationInfoDao.save(decorationInfo);

		// 创建订单归属信息
		decorationBelongDao.save(new DecorationBelongPO().designer(orderId, designer, operater));
		decorationBelongDao.save(new DecorationBelongPO().salesman(orderId, salesman, operater));

		// 创建附加信息
		DecorationAdditionPO additionInfo = new DecorationAdditionPO();
		additionInfo.setOrderId(decorationPO.getOrderId());

		additionInfo.setDesign(decorationPO.getDesigner().getCurrentName(), decorationPO.getDesigner().getDept().getName(), decorationPO.getDesigner().getDept().getName());
		additionInfo.setSales(decorationPO.getSalesman().getCurrentName(), decorationPO.getSalesman().getDept().getName(), decorationPO.getSalesman().getDept().getFatherDept().getName());

		decorationAdditionDao.save(additionInfo);
		
		decorationOperateDao.save(new DecorationOperatePO().create(orderId, operater)); // 创建装修单操作信息

		List<ServiceNodePO> serviceNodes = serviceNodeDao.queryServiceNodeByType(ServiceNodePO.SERVICE_TYPE_DECORTAION_INT);

		if (serviceNodes != null) {

			for (ServiceNodePO serviceNodePO : serviceNodes) {

				DecorationServicePO decorationServicePO = new DecorationServicePO();
				decorationServicePO.setOrderId(decorationPO.getOrderId());
				decorationServicePO.setOperater(decorationPO.getDesigner());
				decorationServicePO.setName(serviceNodePO.getName());
				decorationServicePO.setDetail(serviceNodePO.getDetail());
				decorationServicePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
				decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
				decorationServicePO.setComment("");

				decorationServiceDao.save(decorationServicePO);
			}

		}

		auditDao.save(new AuditPO(decorationPO));

		decorationVO.setOrderId(decorationPO.getOrderId());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void changeDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException {

		String orderId = decorationVO.getOrderId();
		Short type = decorationVO.getType();

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
		}

		if(decorationVO.getGrade() != null){
			decorationPO.setGrade(decorationVO.getGrade());
		}
		
		if(decorationVO.getHouseType() != null){
			decorationPO.setHouseType(decorationVO.getHouseType());
		}

		if(decorationVO.getHouseClass() != null){
			decorationPO.setHouseClass(decorationVO.getHouseClass());
		}
		
		if(type != null){
			decorationPO.setType(type);
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

		decorationPO.setOrderId(newOrderId);
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
		Integer divisor = Integer.valueOf(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		for (QuotationPO quotationPO : quotationPOs) {
			List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid());

			for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

				String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(), divisor);
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
	public void terminalDecoration(DecorationVO decorationVO, float refundValue, float paymentValue, Authentication authentication) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		String userId = authentication.getUserId();
		int company = authentication.getCompany();

		if (DecorationPO.STATUS_SIGNED_INT != decorationPO.getStatus()) { // 签约
			throw new FLException(140025, "订单非签约,不能终止合同");
		}

		decorationPO.setStatus(DecorationPO.STATUS_TERMINATION_INT);
		decorationDao.update(decorationPO);

		DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();
		decorationPaymentPO.setCreater(userDao.queryUserByUserId(userId));
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR);
		decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT);
		decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
		decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
		decorationPaymentPO.setReferMoney(refundValue);
		decorationPaymentPO.setDecoration(decorationPO);
		decorationPaymentPO.setCompany(company);

		decorationPaymentDao.save(decorationPaymentPO);

		if (refundValue < paymentValue) {
			DecorationPaymentPO penalty = new DecorationPaymentPO();
			DecorationReceiptPO decorationReceipt = new DecorationReceiptPO();

			decorationReceipt.setComment(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
			decorationReceipt.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
			decorationReceipt.setCollecter(userDao.queryUserByUserId(userId));

			decorationReceiptDao.save(decorationReceipt);

			penalty.setCreater(userDao.queryUserByUserId(userId));
			penalty.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			penalty.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
			penalty.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_INT);
			penalty.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			penalty.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
			penalty.setReferMoney(Arith.sub(paymentValue, refundValue));
			penalty.setDecoration(decorationPO);
			penalty.setDecorationReceipt(decorationReceipt);
			penalty.setCompany(company);

			decorationPaymentDao.save(penalty);
		}
		
		UserPO operater = userDao.queryUserByUserId(userId);

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
	public String tranDecorationFromCustomerOrigin(DecorationVO decorationVO, long csid, int company) throws FLException {
		
		String orderId = null;
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(csid);

		// 判断客源信息是否存在
		if(customerOriginPO == null){
		      throw new FLException(330001, "客源不存在");
		}
		
		UserPO operater = customerOriginPO.getCreater();

		if (operater == null) {
			throw new FLException(190005, "人员不存在");
		}

		DecorationPO decorationPO = checkOverDecoration(customerOriginPO.getHid(), company);

		if (decorationPO == null) {// 没撞尺 , 创建装修单

			createDecoration(decorationVO, null, operater.getUserId(), company);

			customerOriginPO.setOrderId(decorationVO.getOrderId());
			customerOriginPO.setStatus(CustomerOriginPO.STATUS_CREATE_INT);
		} else {
			orderId = decorationPO.getOrderId();
			
			customerOriginPO.setOrderId(decorationPO.getOrderId());
			customerOriginPO.setStatus(CustomerOriginPO.STATUS_INVALID_INT);
		}
		
		customerOriginDao.update(customerOriginPO);
		
		return orderId;
	}

	private DecorationPO checkOverDecoration(long hid, int company) {

		List<Short> unstatus = Arrays.asList(DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT);

		DecorationPO decorationPO = decorationDao.queryDecorationByHid(hid, company);

		if (decorationPO != null && !unstatus.contains(decorationPO.getStatus())) {
			return decorationPO;
		}

		return null;
	}

	private void addition(DecorationAdditionPO addition, DecorationVO decorationVO) {

		if (addition == null) {
			decorationVO.getDesigner().setCurrentName("");
			decorationVO.getSalesman().setCurrentName("");
			decorationVO.getDesigner().getDept().setName("");
			decorationVO.getSalesman().getDept().setName("");
		} else {
			decorationVO.getDesigner().setCurrentName(addition.getDesigner());
			decorationVO.getSalesman().setCurrentName(addition.getSalesman());
			decorationVO.getDesigner().getDept().setName(addition.getDesignDepartment());
			decorationVO.getSalesman().getDept().setName(addition.getSalesDepartment());
		}
	}

}
