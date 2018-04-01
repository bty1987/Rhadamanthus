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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
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
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.right.dao.DecorationDesignDepartmentRightDao;
import com.fanglin.right.dao.DecorationSalesmanDepartmentRightDao;
import com.fanglin.right.dao.DecorationStatusRightDao;
import com.fanglin.right.po.DecorationDesignDepartmentRightPO;
import com.fanglin.right.po.DecorationSalesmanDepartmentRightPO;
import com.fanglin.right.po.DecorationStatusRightPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Constant;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("quotationOrderService")
@Transactional(readOnly=true)
public class DecorationServiceImpl implements DecorationService {	

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
	private DecorationRankService decorationRankService;
	
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
	
	@Override
	public void pageDecorationForGeneral(Paging paging, List<Filter> filters, Authentication authentication){
		
		if(filters.size() == 0) return ;
		
		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
		
		if(userPO == null) return;
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForGeneral(paging, filters, authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationVO.setSupervisor(new UserBaseVO());
			decorationVO.setEscorter(new UserBaseVO());
			decorationVO.setQuoter(new UserBaseVO());
			
			decorationPO.ptvcascade(decorationVO);

			decorationVOs.add(decorationVO);
		}
		
		paging.setData(decorationVOs);
	}
	
	@Override
	public void pageDecorationForCommon(Paging paging, List<Filter> filters,  Authentication authentication){
		
		if(filters.size() == 0) return;
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<Integer> designDepartmentIds = null;
		List<String> statuses = null;
		
		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRightByUId(userPO.getUid(),company);
		
		designDepartmentIds = new ArrayList<Integer>();
		
		for(DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO: decorationDesignDepartmentRightPOs){
			designDepartmentIds.add(decorationDesignDepartmentRightPO.getDid());
		}
		
		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(),company);
		
		statuses = new ArrayList<String>();
		
		for(DecorationStatusRightPO decorationStatusRightPO: decorationStatusRightPOs){
			statuses.add(decorationStatusRightPO.getStatus());
		}
		
		if(statuses.size() == 0 || designDepartmentIds.size() == 0){
			return;
		}
		
		if(designDepartmentIds.size() == 1 && designDepartmentIds.get(0) == DecorationDesignDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT){
			designDepartmentIds = null;
		}
		
		if(statuses.size() == 1 && DecorationStatusRightPO.STATUS_ALL_ENABLE_STR.equals(statuses.get(0))){
			statuses = null;
		}
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationPO.ptvcascade(decorationVO);
			
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			
			decorationVO.setDiscount(decorationPO.getDiscount());
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoByOrderId(decorationPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getDesigner().getUserId())){ // 设计归属
					decorationVO.getDesigner().setUserName(decorationVO.getDesigner().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getDesigner().getDept().setDeptName(decorationVO.getDesigner().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getSalesman().getUserId())){ // 业务归属
					decorationVO.getSalesman().setUserName(decorationVO.getSalesman().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getSalesman().getDept().setDeptName(decorationVO.getSalesman().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationVOs.add(decorationVO);
		}
		
		paging.setData(decorationVOs);
	}
	
	@Override
	public void pageDecorationForBelong(Paging paging, List<Filter> filters, Authentication authentication){
		
		if(filters.size() == 0) return;
		
		UserPO userPO = userDao.queryUserByUserId(authentication.getUserId());
		
		if(userPO == null) return;
		
		List<String> statuses = Arrays.asList(DecorationPO.STATUS_SIGNED_STR, DecorationPO.STATUS_WASTE_STR, DecorationPO.STATUS_TERMINATION_STR, DecorationPO.STATUS_COMPLETED_STR);
		
		filters.add(new Filter("statuses", statuses, "ni"));
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, null, null, authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationPO.ptvcascade(decorationVO);
			
			decorationVOs.add(decorationVO);
		}
		
		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForDesigner(Paging paging, List<Filter> filters,  Authentication authentication){
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		filters.add(new Filter("designerId", userPO.getUserId(), "eq"));
	
		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForDesign(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);
			
			decorationVO.setDiscount(decorationPO.getDiscount());
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoByOrderId(decorationPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getDesigner().getUserId())){ // 设计归属
					decorationVO.getDesigner().setUserName(decorationVO.getDesigner().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getDesigner().getDept().setDeptName(decorationVO.getDesigner().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getSalesman().getUserId())){ // 业务归属
					decorationVO.getSalesman().setUserName(decorationVO.getSalesman().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getSalesman().getDept().setDeptName(decorationVO.getSalesman().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationVOs.add(decorationVO);
		}
	
		paging.setData(decorationVOs);
	}
	
	@Override
	public void pageDecorationForSalesman(Paging paging, List<Filter> filters,  Authentication authentication){
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		filters.add(new Filter("salesmanId", userPO.getUserId(), "eq"));
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForSalesman(paging, filters, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationVO.setSupervisor(new UserBaseVO());			
			decorationPO.ptvcascade(decorationVO);
			
			if(decorationVO.getOrderTotalPrice() == null){
				decorationVO.setOrderTotalPrice(new Float(0));
			}
			
			if(decorationPO.getOrderTotalPrice() != 0){
				decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			}else{
				decorationVO.setOrderTotalPrice(0f);
			}
			
			decorationVO.setDiscount(decorationPO.getDiscount());
			
			decorationVOs.add(decorationVO);
		}
	
		paging.setData(decorationVOs);
	}

	@Override
	public void pageDecorationForQuoter(Paging paging,List<Filter> filters, Authentication authentication) {
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		filters.add(new Filter("quoterId", userPO.getUserId(), "eq"));
		
		List<Integer> designDepartmentIds = null;
		List<String> statuses = null;
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationPO.ptvcascade(decorationVO);
			
			if(decorationPO.getOrderTotalPrice() != 0){
				decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			}else{
				decorationVO.setOrderTotalPrice(0f);
			}
			
			decorationVO.setDiscount(decorationPO.getDiscount());
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoByOrderId(decorationPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getDesigner().getUserId())){ // 设计归属
					decorationVO.getDesigner().setUserName(decorationVO.getDesigner().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getDesigner().getDept().setDeptName(decorationVO.getDesigner().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getSalesman().getUserId())){ // 业务归属
					decorationVO.getSalesman().setUserName(decorationVO.getSalesman().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getSalesman().getDept().setDeptName(decorationVO.getSalesman().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationVOs.add(decorationVO);
		}
	
		paging.setData(decorationVOs);
		
	}

	@Override
	public void pageDecorationForEscorter(Paging paging,List<Filter> filters, Authentication authentication) {
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		filters.add(new Filter("escorterId", userPO.getUserId(), "eq"));
		
		List<Integer> designDepartmentIds = null;
		List<String> statuses = null;
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecoration(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationPO.ptvcascade(decorationVO);
			
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			
			decorationVO.setDiscount(decorationPO.getDiscount());
		
			List<DecorationBelongInfoPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoByOrderId(decorationPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getDesigner().getUserId())){ // 设计归属
					decorationVO.getDesigner().setUserName(decorationVO.getDesigner().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getDesigner().getDept().setDeptName(decorationVO.getDesigner().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getSalesman().getUserId())){ // 业务归属
					decorationVO.getSalesman().setUserName(decorationVO.getSalesman().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getSalesman().getDept().setDeptName(decorationVO.getSalesman().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationVOs.add(decorationVO);
		}
	
		paging.setData(decorationVOs);
		
	}
	
	@Override
	public void pageDecorationForDesignerManager(Paging paging,List<Filter> filters, Authentication authentication){
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;

		if(filters.size() == 0 ) return;
		
		List<Integer> designDepartmentIds = null;
		List<String> statuses = null;
		
		
		List<DecorationDesignDepartmentRightPO> decorationDesignDepartmentRightPOs = decorationDesignDepartmentRightDao.queryDecorationDesignDepartmentRightByUId(userPO.getUid(),company);
		
		designDepartmentIds = new ArrayList<Integer>();
		
		for(DecorationDesignDepartmentRightPO decorationDesignDepartmentRightPO: decorationDesignDepartmentRightPOs){
			designDepartmentIds.add(decorationDesignDepartmentRightPO.getDid());
		}
		
		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(),company);
		
		statuses = new ArrayList<String>();
		
		for(DecorationStatusRightPO decorationStatusRightPO: decorationStatusRightPOs){
			statuses.add(decorationStatusRightPO.getStatus());
		}
		
		if(statuses.size() == 0 || designDepartmentIds.size() == 0){
			return;
		}
		
		if(designDepartmentIds.size() == 1 && designDepartmentIds.get(0) == DecorationDesignDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT){
			designDepartmentIds = null;
		}
		
		if(statuses.size() == 1 && DecorationStatusRightPO.STATUS_ALL_ENABLE_STR.equals(statuses.get(0))){
			statuses = null;
		}
		
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForDesignerManager(paging, filters, designDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);
			
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			
			decorationVO.setDiscount(decorationPO.getDiscount());
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = decorationBelongDao.queryOrderBelongInfoByOrderId(decorationPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getDesigner().getUserId())){ // 设计归属
					decorationVO.getDesigner().setUserName(decorationVO.getDesigner().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getDesigner().getDept().setDeptName(decorationVO.getDesigner().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationPO.getSalesman().getUserId())){ // 业务归属
					decorationVO.getSalesman().setUserName(decorationVO.getSalesman().getUserName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationVO.getSalesman().getDept().setDeptName(decorationVO.getSalesman().getDept().getDeptName() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationVOs.add(decorationVO);
		}
		
		paging.setData(decorationVOs);
	}
	
	@Override
	public void pageDecorationForSalesmanManager(Paging paging,List<Filter> filters, Authentication authentication){
		if(filters.size() == 0) return;
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return;
		
		List<Integer> salesmanDepartmentIds = null;
		List<String> statuses = null;
		
	
		List<DecorationSalesmanDepartmentRightPO> decoratoinOrderSalesmanDepartmentRightPOs = decorationSalesmanDepartmentRightDao.queryDecorationSalesmanDepartmentRightByUId(userPO.getUid(),company);
		
		if(decoratoinOrderSalesmanDepartmentRightPOs.isEmpty()) return;
				
		salesmanDepartmentIds = new ArrayList<Integer>();
		
		for(DecorationSalesmanDepartmentRightPO decorationSalesmanDepartmentRightPO: decoratoinOrderSalesmanDepartmentRightPOs){
			salesmanDepartmentIds.add(decorationSalesmanDepartmentRightPO.getDid());
		}
		
		List<DecorationStatusRightPO> decorationStatusRightPOs = decorationStatusRightDao.queryDecorationStatusRightByUId(userPO.getUid(),company);
		
		statuses = new ArrayList<String>();
		
		for(DecorationStatusRightPO decorationStatusRightPO: decorationStatusRightPOs){
			statuses.add(decorationStatusRightPO.getStatus());
		}
		
		if(statuses.size() == 0 || salesmanDepartmentIds.size() == 0){
			return;
		}
		
		if(salesmanDepartmentIds.size() == 1 && salesmanDepartmentIds.get(0) == DecorationSalesmanDepartmentRightPO.DEPARTMENT_ALL_ENABLE_INT){
			salesmanDepartmentIds = null;
		}
		
		if(statuses.size() == 1 && DecorationStatusRightPO.STATUS_ALL_ENABLE_STR.equals(statuses.get(0))){
			statuses = null;
		}
		
		
		List<DecorationPO> decorationPOs = decorationDao.pageDecorationForSalesmanManager(paging, filters, salesmanDepartmentIds, statuses, company);
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			DecorationVO decorationVO = new DecorationVO();
			
			decorationVO.setSupervisor(new UserBaseVO());
			decorationPO.ptvcascade(decorationVO);
			
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			
			decorationVO.setDiscount(decorationPO.getDiscount());
			
			decorationVOs.add(decorationVO);
		}
	
		paging.setData(decorationVOs);
	}
	
	@Override
	public DecorationVO queryDecorationById(String decorationOrderId) throws FLException{
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationOrderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		DecorationVO decorationVO = new DecorationVO();
		
		decorationVO.setEscorter(new UserBaseVO());
		decorationVO.setQuoter(new UserBaseVO());
		decorationVO.setSupervisor(new UserBaseVO());
		
		decorationPO.ptvcascade(decorationVO);
		
		if(decorationVO.getOrderTotalPrice() == null || decorationVO.getOrderTotalPrice() == 0){
			
			decorationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			
		}
		
		try {
			decorationVO.setDompany(AESHelper.encryptToString(FormatUtil.encodeCompany(decorationPO.getCompany()),SystemConfig.getString("encryptKey")));
		} catch (Exception e) {		
			 throw new FLException(140013, "订单不存在");
		}
		
		return decorationVO;
	}

	@Override
	public DecorationVO queryDecorationForCommonByOrderId(DecorationVO decorationVO, String userId) throws FLException{
		
		List<String> unstatus = Arrays.asList(new String[]{DecorationPO.STATUS_SIGNED_STR, DecorationPO.STATUS_TERMINATION_STR, DecorationPO.STATUS_COMPLETED_STR});
		
		decorationVO = queryDecorationById(decorationVO.getOrderId());
		
		String status = decorationVO.getStatus();
		
		if(!unstatus.contains(status)){
			
			UserPO userPO = userDao.queryUserByUserId(userId);
			
			if(userPO != null && !userPO.getDept().getDeptName().contains("客服")){
				decorationVO.getCustomer().setConfidentialInfo();
			}
		}
		
		return decorationVO;
	}
	
	@Override
	public DecorationVO queryDecorationForDesignerByOrderId(DecorationVO decorationVO, String userId) throws FLException{

		decorationVO = queryDecorationById(decorationVO.getOrderId());

		return decorationVO;
	}
	
	@Override
	public List<DecorationVO> queryDecorationByCustomerId(DecorationVO decorationVO, Authentication authentication){
		
		CustomerVO customerVO = decorationVO.getCustomer();
		
		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomer(customerVO.getCid(), customerVO.getNo(), authentication.getCompany());
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		
		for(DecorationPO decorationPO: decorationPOs){
			
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
	public DecorationVO checkDecoration(Paging paging,List<Filter> filters, Authentication authentication) {
		
		List<DecorationVO> decorationVOs = new ArrayList<DecorationVO>();
		DecorationVO decorationVO = new DecorationVO();
		
		if(filters.size() == 0) return decorationVO;
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null) return decorationVO;
		
		if(paging == null){
			paging = new Paging();
			paging.setPage(1);
			paging.setRows(10);
		}
		
		List<DecorationPO> decorationPOs = decorationDao.checkDeoration(paging, filters, company);
		
		if(decorationPOs.isEmpty()) return decorationVO;
		
		for(DecorationPO decorationPO: decorationPOs){
			
			decorationVO = new DecorationVO();
			
			decorationVO.setOrderId(decorationPO.getOrderId());
			
			decorationVO.setDesigner(new UserBaseVO());
			decorationVO.getDesigner().setDuty(new DutyVO());
			decorationVO.getDesigner().setDept(new DepartmentVO());
			decorationVO.getDesigner().getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyPropertie(decorationPO.getDesigner(), decorationVO.getDesigner(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(decorationPO.getDesigner().getDuty(), decorationVO.getDesigner().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(decorationPO.getDesigner().getDept(), decorationVO.getDesigner().getDept(), Arrays.asList("type","fatherDept","cityProper"));
			BeanUtil.copyPropertie(decorationPO.getDesigner().getDept().getFatherDept(), decorationVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));		
			
			decorationVO.setSalesman(new UserBaseVO());
			decorationVO.getSalesman().setDuty(new DutyVO());
			decorationVO.getSalesman().setDept(new DepartmentVO());
			decorationVO.getSalesman().getDept().setFatherDept(new DepartmentVO());
			
			BeanUtil.copyPropertie(decorationPO.getSalesman(), decorationVO.getSalesman(), Arrays.asList("duty","dept"));
			BeanUtil.copyPropertie(decorationPO.getSalesman().getDuty(), decorationVO.getSalesman().getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(decorationPO.getSalesman().getDept(), decorationVO.getSalesman().getDept(), Arrays.asList("type","fatherDept","cityProper"));
			BeanUtil.copyPropertie(decorationPO.getSalesman().getDept().getFatherDept(), decorationVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));

			
			decorationVOs.add(decorationVO);
		}
		
		paging.setData(decorationVOs);
		
		return decorationVOs.get(0);
	}

	@Override
	public void checkDecorationExist(DecorationVO decorationVO){
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());
		
		if(decorationPO != null){
			
			decorationPO.ptvcascade(decorationVO);
			
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationForAdvance(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO) throws FLException{
		
		String orderId = decorationVO.getOrderId();
		Short type = decorationVO.getType();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		List<String> status = Arrays.asList(new String[]{DecorationPO.STATUS_INIT_STR, DecorationPO.STATUS_QUOTATION_STR, DecorationPO.STATUS_DEPOSIT_STR, DecorationPO.STATUS_RESIGNED_STR}); // 咨询, 量房, 已报价, 定金, 重签合同
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!status.contains(decorationPO.getStatus())) return 0;
		
		if(decorationVO.getNotSalesmanRate() != null){
			decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
		}
		
		decorationPO.setHouseType(decorationVO.getHouseType());
		decorationPO.setFreeArea(decorationVO.getFreeArea());
		decorationPO.setHouseClass(decorationVO.getHouseClass());
		decorationPO.setType(type);
	
		DecorationInfoPO decorationInfoPO = decorationInfoDao.queryDecorationInfoByOrderId(orderId);
		
		if(decorationInfoPO == null){
			decorationInfoPO = new DecorationInfoPO(orderId);
		}
		
		BeanUtil.copyPropertie(decorationInfoVO, decorationInfoPO);
		
		decorationInfoDao.saveOrUpdate(decorationInfoPO);
		
		if(decorationVO.getQuoter() != null){
			UserPO quoter = userDao.queryUserByUserId(decorationVO.getQuoter().getUserId());
			decorationPO.setQuoter(quoter);
		}
		
		if(decorationVO.getEscorter() != null ){
			UserPO escorter = userDao.queryUserByUserId(decorationVO.getEscorter().getUserId());
			decorationPO.setEscorter(escorter);
		}
		
		decorationDao.update(decorationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationForVersionId(DecorationVO decorationVO, String userId){
		
		String orderId = decorationVO.getOrderId();
		String versionId = decorationVO.getVersion().getVersionId();
		
		List<String> status = Arrays.asList(new String[]{DecorationPO.STATUS_SIGNED_STR, DecorationPO.STATUS_COMPLETED_STR, DecorationPO.STATUS_WASTE_STR, DecorationPO.STATUS_TERMINATION_STR}); // 已签约, 已完工, 废单, 合同终止
		
		String oldVersionId = "";
		DecorationPO DecorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(DecorationPO != null && !status.contains(DecorationPO.getStatus())){
			
			oldVersionId = DecorationPO.getVersion().getVersionId();
			
			DecorationPO.setVersion(new QuotationVersionPO(versionId));
			
			List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(orderId);
			Integer divisor = Integer.valueOf(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
			
			for(QuotationPO quotationPO: quotationPOs){
				List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid());
				
				for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
					
					String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(),divisor);
					quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(tableName,quotationFunctionAreaPO.getQfaId());
					
					quotationFunctionAreaDao.delete(quotationFunctionAreaPO);
				}
				
				quotationDao.delete(quotationPO);
			}
			
			decorationDao.update(DecorationPO);
			
			StringBuffer serviceRecoraInfo = new StringBuffer();
			serviceRecoraInfo.append("订单编号:");
			serviceRecoraInfo.append(orderId);
			serviceRecoraInfo.append("报价版本修改,原报价版本:");
			serviceRecoraInfo.append(oldVersionId);
			serviceRecoraInfo.append(",修改报价版本为:");
			serviceRecoraInfo.append(versionId);
			serviceRecoraInfo.append(".");
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_VERSIONID_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(serviceRecoraInfo.toString());
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationForOrderId(String oldOrderId, String newOrderId, String userId) throws FLException{
		
		DecorationPO decorationPO;
		
		decorationPO = decorationDao.queryDecorationByOrderId(newOrderId);
		
		if(decorationPO != null){
			throw new FLException(140010, "订单编号已经存在");
		}
		
		decorationPO = decorationDao.queryDecorationByOrderId(oldOrderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
			
		decorationBelongDao.changeOrderBelongInfoForOrderId(newOrderId, oldOrderId);
		decorationPaymentDao.changeDecorationPaymentForOrderId(oldOrderId, newOrderId);
		
		decorationPO.setOrderId(newOrderId);
		decorationDao.changeDecorationForOrderId(newOrderId, oldOrderId);
		
		ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
		serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_ORDERID_INT);
		serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		serviceRecordPO.setOperateUserId(userId);
		serviceRecordPO.setInfo(String.format("订单编号修改,原订单编号:%s,修改编号为:%s.", oldOrderId, newOrderId));
		
		serviceRecordDao.saveOrUpdate(serviceRecordPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationForTime(DecorationVO decorationVO, int timeType, Timestamp dateTime, String userId){
		
		String orderId = decorationVO.getOrderId();

		Timestamp oldTime = null;
		
		Map<Integer, String> types = new HashMap<Integer, String>();
		types.put(1, "录入时间");
		types.put(2, "签单时间");
		
		DecorationPO DecorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(DecorationPO != null){
			
			if(timeType == 1){
				oldTime = DecorationPO.getMeasureTime();
				
				DecorationPO.setMeasureTime(dateTime);
			}else if(timeType == 2){
				oldTime = DecorationPO.getContractTime();
				
				DecorationPO.setContractTime(dateTime);
			}
			
			decorationDao.update(DecorationPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s,类型为:%s,录入时间修改,原录入时间:%s,修改录入时间为:%s.", orderId, types.get(timeType), oldTime != null ? oldTime.toString() : "空", dateTime.toString()));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationForStatus(DecorationVO decorationVO, String userId){
		
		String orderId = decorationVO.getOrderId();
		String status = decorationVO.getStatus();
		
		String oldStatus = "";
		DecorationPO DecorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(DecorationPO != null){
			oldStatus = DecorationPO.getStatus();
			
			DecorationPO.setStatus(status);
			
			decorationDao.update(DecorationPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s状态修改,原状态:%s,修改状态为:%s.", orderId, oldStatus, status));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}
	
	@Override
	public void changeDecorationForType(DecorationVO decorationVO, String userId) {
		String orderId = decorationVO.getOrderId();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO != null){
			short oldType = decorationPO.getType();
			
			decorationPO.setType(decorationVO.getType());
			
			decorationDao.update(decorationPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s状态修改,原类型:%s,修改类型为:%s.", orderId, String.valueOf(oldType), String.valueOf(decorationVO.getType())));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationForHouse(DecorationVO decorationVO,	String userId) {
		String orderId = decorationVO.getOrderId();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO != null){
			String oldHouse = String.valueOf(decorationPO.getHouse().getHid() + "  " +decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber());
			
			HousePO housePO = houseDao.get(decorationVO.getHouse().getHid());
			decorationPO.setHouse(housePO);

			String newHouse = String.valueOf(housePO.getHid() + "  " +housePO.getVillage().getName() + " " + housePO.getHouseNumber());
			
			decorationDao.update(decorationPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType((short)9);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s房产修改,原房产:%s,修改房产为:%s.", orderId, oldHouse, newHouse));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
		
	}


	@Override
	@Transactional(rollbackFor=Exception.class)
	public void createDecoration(DecorationVO decorationVO, DecorationInfoVO decorationInfoVO, Authentication authentication) throws FLException{
		
		List<String> unstatus = Arrays.asList(DecorationPO.STATUS_WASTE_STR, DecorationPO.STATUS_TERMINATION_STR);
		
		DecorationPO decorationPO = decorationDao.queryDecorationByHid(decorationVO.getHouse().getHid(), authentication.getCompany());
		
		if(decorationPO != null && !unstatus.contains(decorationPO.getStatus())){
			throw new FLException(140034, "订单楼盘,楼号已存在");
		}
		
		decorationPO = new DecorationPO();
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByDefaultFlag(company,1).get(0);
		decorationPO.setVersion(quotationVersionPO);
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate);
		
		String orderId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		decorationPO.setOrderId(orderId);
		
		if(decorationVO.getNotSalesmanRate() == null || decorationVO.getNotSalesmanRate() > 1 || decorationVO.getNotSalesmanRate() < 0){
			decorationPO.setNotSalesmanRate((float) 0);
		}else{
			decorationPO.setNotSalesmanRate(decorationVO.getNotSalesmanRate());
		}
		

		decorationPO.setFreeArea((float) 0);
		decorationPO.setHouseClass(decorationVO.getHouseClass());
		decorationPO.setHouseType(decorationVO.getHouseType());
		decorationPO.setStatus(DecorationPO.STATUS_INIT_STR);
		decorationPO.setResourceType(decorationVO.getResourceType());
		decorationPO.setOrderTotalPrice((float) 0);
		decorationPO.setSalesmanType(decorationVO.getSalesmanType());
		decorationPO.setCompany(company);
		decorationPO.setPaySacle((short) 0);
		
		decorationPO.setCustomer(new CustomerPO(decorationVO.getCustomer().getCid()));
		decorationPO.setHouse(new HousePO(decorationVO.getHouse().getHid()));
		
		UserPO designer = userDao.queryUserByUserId(decorationVO.getDesigner().getUserId());
		UserPO salesman = userDao.queryUserByUserId(decorationVO.getSalesman().getUserId());
		
		if(decorationVO.getQuoter() != null){
			UserPO quoter = userDao.queryUserByUserId(decorationVO.getQuoter().getUserId());
			decorationPO.setQuoter(quoter);
		}
		
		if(decorationVO.getEscorter() != null ){
			UserPO escorter = userDao.queryUserByUserId(decorationVO.getEscorter().getUserId());
			decorationPO.setEscorter(escorter);
		}
		
		
		decorationPO.setDesigner(designer);
		decorationPO.setSalesman(salesman);
		
		decorationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setMeasureTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO operater = userDao.queryUserByUserId(authentication.getUserId());
		decorationPO.setCreateUser(operater);
		
		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_INITIAL_INT);
		
		decorationPO.setOtherStatus(0);
		decorationPO.setType(decorationVO.getType());
		
		decorationPO.setHouse(new HousePO(decorationVO.getHouse().getHid()));
		
		decorationDao.save(decorationPO);
		
		DecorationInfoPO decorationInfo = new DecorationInfoPO();
		
		BeanUtil.copyPropertie(decorationInfoVO, decorationInfo);
		decorationInfo.setOrderId(orderId);
		
		decorationInfoDao.save(decorationInfo);
		
		//创建订单归属信息
		DecorationBelongInfoPO belongDesignerInfo = new DecorationBelongInfoPO();
		belongDesignerInfo.setBelongDeptPO(decorationPO.getDesigner().getDept());
		belongDesignerInfo.setBelongRate((float) 1);
		belongDesignerInfo.setBelongRegionPO(decorationPO.getDesigner().getDept().getFatherDept());
		belongDesignerInfo.setBelongUserPO(decorationPO.getDesigner());
		belongDesignerInfo.setBelongType(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR);
		belongDesignerInfo.setDefaultFlag(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR);
		belongDesignerInfo.setOperateUserPO(operater);
		belongDesignerInfo.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		belongDesignerInfo.setStatus(DecorationBelongInfoPO.STATUS_PASS_STR);
		belongDesignerInfo.setDecorationPO(decorationPO);
		decorationBelongDao.save(belongDesignerInfo);
		
		DecorationBelongInfoPO belongsalesmanInfo = new DecorationBelongInfoPO();
		belongsalesmanInfo.setBelongDeptPO(decorationPO.getSalesman().getDept());
		belongsalesmanInfo.setBelongRate((float) 1);
		
		if(decorationPO.getSalesman().getDept().getFatherDept() == null){
			belongsalesmanInfo.setBelongRegionPO(null);
		}else{
			belongsalesmanInfo.setBelongRegionPO(decorationPO.getSalesman().getDept().getFatherDept());
		}
		
		belongsalesmanInfo.setBelongUserPO(decorationPO.getSalesman());
		belongsalesmanInfo.setBelongType(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR);
		belongsalesmanInfo.setDefaultFlag(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR);
		belongsalesmanInfo.setOperateUserPO(operater);
		belongsalesmanInfo.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		belongsalesmanInfo.setStatus(DecorationBelongInfoPO.STATUS_PASS_STR);
		belongsalesmanInfo.setDecorationPO(decorationPO);
		
		decorationBelongDao.save(belongsalesmanInfo);
		
		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
		decorationOperatePO.setDecoration(decorationPO);
		decorationOperatePO.setOperater(userDao.queryUserByUserId(userId));
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setType(DecorationOperatePO.TYPE_CREATE_DECORATION_ORDER_INT);
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setDes("创建订单");
		
		decorationOperateDao.save(decorationOperatePO);
		
		DecorationOperatePO belongDecorationOperatePO = new DecorationOperatePO();
		belongDecorationOperatePO.setDecoration(decorationPO);
		belongDecorationOperatePO.setOperater(userDao.queryUserByUserId(userId));
		belongDecorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		belongDecorationOperatePO.setSourcer(decorationPO.getSalesman());
		belongDecorationOperatePO.setTarger(decorationPO.getDesigner());
		belongDecorationOperatePO.setType(DecorationOperatePO.TYPE_DESIGNER_DECORATION_ORDER_INT);
		belongDecorationOperatePO.setValue(1f);
		belongDecorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		belongDecorationOperatePO.setDes("订单归属");
		
		AuditPO auditPO = new AuditPO();
	    auditPO.setDecoration(decorationPO);
	    auditDao.save(auditPO);
	    
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int obsoleteDecoration(DecorationVO decorationVO, String userId) throws FLException{
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		String status = decorationPO.getStatus();
		
		if(DecorationPO.STATUS_WASTE_STR.equals(status)){ // 废单
			throw new FLException(140021, "订单已处于废单状态");
		}
		
		if(DecorationPO.STATUS_SIGNED_STR.equals(status)){ // 签约
			throw new FLException(140022, "订单已签约,不可废单");
		}
		
		if(DecorationPO.STATUS_COMPLETED_STR.equals(status)){ // 完工
			throw new FLException(140023, "订单已完工,不可废单");
		}
		
		if(DecorationPO.STATUS_TERMINATION_STR.equals(status)){ // 终止
			throw new FLException(140024, "订单合同终止,不可废单");
		}
		
		if(DecorationPO.STATUS_RESIGNED_STR.equals(status)){
			throw new FLException(140026, "订单重新签约,不能终止合同"); // 重新签约
		}
		
		decorationPO.setStatus(DecorationPO.STATUS_WASTE_STR);
		
		decorationDao.update(decorationPO);
		
		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
		decorationOperatePO.setDecoration(decorationPO);
		decorationOperatePO.setOperater(userDao.queryUserByUserId(userId));
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setType(DecorationOperatePO.TYPE_WASTE_DECORATION_ORDER_INT);
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setDes("废弃订单");
		
		decorationOperateDao.save(decorationOperatePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int terminalDecoration(DecorationVO decorationVO, float refundValue, float paymentValue, Authentication authentication) throws FLException{
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());
		
		String userId = authentication.getUserId();
		int company = authentication.getCompany();
		
		if(DecorationPO.STATUS_SIGNED_STR.equals(decorationPO.getStatus())){ // 签约

			decorationPO.setStatus(DecorationPO.STATUS_TERMINATION_STR);
			decorationDao.update(decorationPO);
			
			DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();
			decorationPaymentPO.setCreater(userDao.queryUserByUserId(userId));
			decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR);
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
			decorationPaymentPO.setReferMoney(refundValue);
			decorationPaymentPO.setDecoration(decorationPO);
			
			decorationPaymentDao.save(decorationPaymentPO);

			if(refundValue < paymentValue){
				DecorationPaymentPO penalty = new DecorationPaymentPO();
				DecorationReceiptPO decorationReceipt = new DecorationReceiptPO();
				
				decorationReceipt.setComment(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
				decorationReceipt.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
				decorationReceipt.setCollecter(userDao.queryUserByUserId(userId));
				
				decorationReceiptDao.save(decorationReceipt);
				
				penalty.setCreater(userDao.queryUserByUserId(userId));
				penalty.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				penalty.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
				penalty.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);
				decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
				decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_DEAL_INT);
				penalty.setReferMoney(Arith.sub(paymentValue, refundValue));
				penalty.setDecoration(decorationPO);
				penalty.setDecorationReceipt(decorationReceipt);
				
				decorationPaymentDao.save(penalty);
			}
			
			float orderTotalPrice = Arith.sub(0, decorationPO.getOrderTotalPrice());
			
			UserPO userPO = decorationPO.getDesigner();
			DepartmentPO departmentPO = userPO.getDept();
			DepartmentPO regionPO = userPO.getDept().getFatherDept();
			
			String designerId = userPO.getUserId();
			String designerName = userPO.getUserName();
			
			String departmentId = departmentPO.getDeptId();
			String departmentName = departmentPO.getDeptName();
			
			String regionId = regionPO.getDeptId();
			String regionName = regionPO.getDeptName();
			
			String currentTimeStr = DateUtil.current("yyyy-MM-dd");
			
			String notCountDesignDepartmentId = SystemConfig.getString("notCountDesignDepartmentId", "");
			
			if(notCountDesignDepartmentId.indexOf(designerId) == -1){ // 部分部门不参与业绩统计
				decorationRankService.updateDecorationDesignerRank(designerId, designerName, orderTotalPrice, currentTimeStr, company);
				decorationRankService.updateDecorationDesignerDepartmentRank(departmentId, departmentName, orderTotalPrice, currentTimeStr, company);
				decorationRankService.updateDecorationDesignerRegionRank(regionId, regionName, orderTotalPrice, currentTimeStr, company);
			}
			
			DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
			decorationOperatePO.setDecoration(decorationPO);
			decorationOperatePO.setOperater(userDao.queryUserByUserId(userId));
			decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationOperatePO.setType(DecorationOperatePO.TYPE_TERMINATION_DECORATION_ORDER_INT);
			decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
			decorationOperatePO.setDes("订单合同终止");
			
			decorationOperateDao.save(decorationOperatePO);
			
			return 0;
		}

		throw new FLException(140025, "订单非签约,不能终止合同");
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int subDecorationForQuotationTime(DecorationVO decorationVO, String userId) throws FLException {
		
		DecorationPO DecorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());
		
		if(DecorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(DecorationPO.getQuotationTimeLimit() > 0){
			DecorationPO.setQuotationTimeLimit(DecorationPO.getQuotationTimeLimit() - 1);
			
			decorationDao.update(DecorationPO);
			
			DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
			decorationOperatePO.setDecoration(DecorationPO);
			decorationOperatePO.setOperater(userDao.queryUserByUserId(userId));
			decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SUB_DECORATION_QUOTATION_NUM_INT);
			decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
			decorationOperatePO.setDes("订单报价限制次数减少");
			
			decorationOperateDao.save(decorationOperatePO);
		}
		
		return 0;
	}


}
