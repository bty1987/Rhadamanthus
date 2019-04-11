/**
 * @File Name		: DecorationContractServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationMidpackVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Service("decorationContractService")
@Transactional(readOnly = true)
public class DecorationContractServiceImpl implements DecorationContractService {

	@Autowired
	private DecorationContractDao decorationContractDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationBelongDao orderBelongInfoDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private DecorationOperateDao decorationOperateDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;
	
	@Autowired
	private DecorationPaymentService decorationPaymentService;
	
	@Autowired
	private DecorationActivityDao decorationActivityDao;
	
	@Override
	public DecorationContractVO queryDecorationContractByOrderId(DecorationContractVO decorationContractVO) throws FLException {

		String orderId = decorationContractVO.getOrderId();
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT, DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT };

		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);

		if (decorationContractPO != null) {
			BeanUtil.copyProperties(decorationContractPO, decorationContractVO);
		}

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(orderId, paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);
		List<DecorationPaymentVO> payments = new ArrayList<DecorationPaymentVO>();

		for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO, Arrays.asList("decoration", "creater", "collecter", "confirmer"));

			payments.add(_decorationPaymentVO);
		}
		decorationContractVO.setPayments(payments);

		return decorationContractVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public DecorationContractVO queryDecorationContractForQuotationByOrderId(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());

		if (decorationContractPO != null) {
			BeanUtil.copyProperties(decorationContractPO, decorationContractVO);

			if (decorationContractPO.getOrderTotalPrice() == 0f && decorationContractPO.getDecorationPO() != null) {
				decorationContractPO.setOrderTotalPrice(decorationContractPO.getDecorationPO().getOrderTotalPrice());

				decorationContractDao.update(decorationContractPO);
			}
		} else {
			decorationContractVO.setTemplateHtml(SystemConfig.getString("contractPath"));
		}

		return decorationContractVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int saveDecorationContract(DecorationContractVO decorationContractVO, int company) throws FLException {

		List<Short> noUpdateStatus = Arrays.asList(new Short[] { DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT }); // 已签约,
																																																			// 已完工,
																																																			// 废单,
																																																			// 合同终止

		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());

		if (decorationContractPO != null) {
			if (noUpdateStatus.contains(decorationContractPO.getDecorationPO().getStatus())) {
				throw new FLException(140005, "订单合同不能修改");
			}
		} else {
			decorationContractPO = new DecorationContractPO();
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationContractVO.getOrderId());

		StringBuffer contractCode = new StringBuffer(SystemConfig.getString("contractStartWith", "FLJ-"));
		contractCode.append(decorationPO.getOrderId());

		decorationContractPO.setAdditionalInfo(decorationContractVO.getAdditionalInfo());
		decorationContractPO.setEndTime(decorationContractVO.getEndTime());
		decorationContractPO.setStartTime(decorationContractVO.getStartTime());
		decorationContractPO.setDecorationPO(decorationPO);
		decorationContractPO.setContractCode(contractCode.toString());
		decorationContractPO.setWorkingDuration(decorationContractVO.getWorkingDuration());

		decorationContractPO.setTemplateHtml(systemConfigDao.querySystemConfig("contractPath", company).value("default.html"));

		decorationContractPO.setSignTime(DateUtil.getDateToTimestamp(new Date()));

		decorationContractDao.saveOrUpdate(decorationContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int signDecorationContract(DecorationContractVO decorationContractVO, Authentication authentication) throws FLException {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		boolean resignFlag = false;
		String orderId = decorationContractVO.getOrderId();
		String userId = authentication.getUserId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140005, "订单合同不能修改");
		}

		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		if (decorationPayments == null || decorationPayments.size() == 0) {
			throw new FLException(140006, "订单没有进行款项交付,不能签订合同");
		}

		if (approvalDao.countApprovalForInitByIdent(orderId) > 0) {
			throw new FLException(140037, "订单存在未处理审批项");
		}

		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);

		if (decorationContractPO == null) {
			decorationContractPO = new DecorationContractPO();
			decorationContractPO.setDecorationPO(decorationPO);
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(140008, "订单没有报价信息");
		}

		quotationDao.updateQuotationForStatusByOrderId(orderId, QuotationPO.STATUS_LOCK_INT);

		if (DecorationPO.STATUS_RESIGNED_INT == decorationPO.getStatus()) {
			resignFlag = true;
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationPO.setNetperfor(decorationContractVO.getNetperfor());
		decorationPO.setComperfor(decorationContractVO.getComperfor());
		decorationPO.setStatus(DecorationPO.STATUS_SIGNED_INT);
		decorationPO.setContracter(operater);

		List<DecorationBelongPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT);
		List<DecorationBelongPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (!resignFlag) {
			decorationPO.setContractTime(DateUtil.getDateToTimestamp(new Date()));
		}

		decorationDao.update(decorationPO);

		DecorationOperatePO decorationOperatePO = new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice());

		if (!resignFlag) {

			decorationAdditionPO.clearDesign();
			decorationAdditionPO.clearSales();

			// 更新归属信息的部门和大区, 更新附加信息
			for (DecorationBelongPO decorationBelongPO : designerOrderBelongInfoPOs) {
				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setDesign(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				orderBelongInfoDao.update(decorationBelongPO);
			}

			for (DecorationBelongPO decorationBelongPO : salemsanOrderBelongInfoPOs) {
				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setSales(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				orderBelongInfoDao.update(decorationBelongPO);
			}

			decorationAdditionDao.update(decorationAdditionPO);
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SIGN_DECORATION_ORDER_INT);

		} else {
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SIGNED_DECORATION_ORDER_INT);
		}

		decorationOperateDao.save(decorationOperatePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {

		String orderId = decorationContractVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (DecorationPO.STATUS_SIGNED_INT != (decorationPO.getStatus())) {//判断装修单状态为3(签约), 其他状态不能重签
			throw new FLException(140027, "订单状态不能重签合同");
		}

		if (approvalDao.countApprovalForInitByIdent(orderId) > 0) {
			throw new FLException(140037, "订单存在未处理审批项");
		}

		if (addReduceDao.countAddReduceByOrderId(orderId) > 0) {
			throw new FLException(140041, "订单存在增减项,不能重新签单");
		}

		decorationPO.setStatus(DecorationPO.STATUS_RESIGNED_INT);

		decorationDao.update(decorationPO);

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationOperateDao.save(new DecorationOperatePO().resign(orderId, operater, -decorationPO.getOrderTotalPrice()));
		
//		重签处理过程 , 需要冲减之前计算的设计师/业务员业绩信息
//		List<DecorationBelongPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT);
//		List<DecorationBelongPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
//		DecorationOperateServiceImpl.makeDecorationOperateForDecorationContract(decorationOperateDao, decorationPO, salemsanOrderBelongInfoPOs, designerOrderBelongInfoPOs, operater, decorationPO.getOrderTotalPrice(), -1, decorationOperatePO.getType());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int presignDecorationContract(DecorationVO decorationVO, String userId) throws FLException {
		
		String orderId = decorationVO.getOrderId();
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT });
		
		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}
		
		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140005, "订单合同不能修改");
		}
		
		decorationPO.setPrecontractPrice(decorationVO.getPrecontractPrice());
		decorationPO.setPrecontractTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setStatus(DecorationPO.STATUS_PROSIGN_INT); // 预签
		
		decorationDao.update(decorationPO);
		
		UserPO operater = userDao.queryUserByUserId(userId);
		decorationOperateDao.save(new DecorationOperatePO().prosign(orderId, operater)); // 创建装修单操作信息
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationMidpack(DecorationMidpackVO decorationMidpackVO, String userId) throws FLException {
		
		String orderId = decorationMidpackVO.getDecoration().getOrderId();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}
		
		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });
		
		if (!status.contains(decorationPO.getStatus())){
			throw new FLException(150002, "合同已签订不可修改");
		}
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}
		
		if(quotationPO.getStatus() != QuotationPO.STATUS_LOCK_INT){
			throw new FLException(200031, "报价未锁定");
		}
		
		if(decorationActivityDao.countDecorationActivity(orderId, null) == 0){
			throw new FLException(140033, "订单活动信息不存在");
		}
		
		if(decorationActivityDao.countDecorationActivity(orderId, DecorationActivityPO.STATUS_INIT_INT) > 0){
			throw new FLException(140060, "活动未锁定");
		}
		
		decorationPaymentService.makeDecorationPayment(decorationPO, quotationPO.getTotalPrice(), decorationMidpackVO.getPsId(), userId);
		
		return 0;
	}
	
}
