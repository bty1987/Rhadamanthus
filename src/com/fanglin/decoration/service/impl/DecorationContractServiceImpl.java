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
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
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
@Transactional(readOnly=true)
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
	private SystemConfigDao SystemConfigDao;
	
	@Override
	public DecorationContractVO queryDecorationContractByOrderId(DecorationContractVO decorationContractVO) throws FLException{
		
		String orderId = decorationContractVO.getOrderId();
		String[] paymentStatus = new String[]{DecorationPaymentPO.PAYMENTSTATUS_APPLY_STR,DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR,DecorationPaymentPO.PAYMENTSTATUS_PAY_STR,DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR};
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);
		
		if(decorationContractPO != null){
			BeanUtil.copyProperties(decorationContractPO, decorationContractVO);
		}
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(orderId,paymentStatus,DecorationPaymentPO.ONETYPE_ADD_INT,DecorationPaymentPO.TWOTYPE_DEAL_INT);
		List<DecorationPaymentVO> payments = new ArrayList<DecorationPaymentVO>();

		for(DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs){
			DecorationPaymentVO _decorationPaymentVO = new DecorationPaymentVO();
			BeanUtil.copyProperties(decorationPaymentPO, _decorationPaymentVO,Arrays.asList("decoration","creater","collecter","confirmer"));

			payments.add(_decorationPaymentVO);
		}
		decorationContractVO.setPayments(payments);
		decorationContractVO.setPaymentRates(Arrays.asList(SystemConfig.getInt("firstRate"), SystemConfig.getInt("firstSecondRate"), SystemConfig.getInt("secondRate"), SystemConfig.getInt("lastRate")));
		
		return decorationContractVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public DecorationContractVO queryDecorationContractForQuotationByOrderId(DecorationContractVO decorationContractVO)  throws FLException{
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());
		
		if(decorationContractPO != null){
			BeanUtil.copyProperties(decorationContractPO, decorationContractVO);
			
			if(decorationContractPO.getOrderTotalPrice() == 0f && decorationContractPO.getDecorationPO() != null){
				decorationContractPO.setOrderTotalPrice(decorationContractPO.getDecorationPO().getOrderTotalPrice());
				
				decorationContractDao.update(decorationContractPO);
			}
		}else{
			decorationContractVO.setTemplateHtml(SystemConfig.getString("contractPath"));
		}
		
		return decorationContractVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveDecorationContract(DecorationContractVO decorationContractVO) throws FLException{
		
		List<Short> noUpdateStatus = Arrays.asList(new Short[]{DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT}); // 已签约, 已完工, 废单, 合同终止
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());
		
		if(decorationContractPO != null){
			if(noUpdateStatus.contains(decorationContractPO.getDecorationPO().getStatus())){
				throw new FLException(140005, "订单合同不能修改");
			}
		}else{
			decorationContractPO = new DecorationContractPO();
		}
	
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationContractVO.getOrderId());
		
		StringBuffer contractCode= new StringBuffer(SystemConfig.getString("contractStartWith", "FLJ-"));
		contractCode.append(decorationPO.getOrderId());
		contractCode.append("-");
		contractCode.append(decorationPO.getDesigner().getDept().getContractPrefix());
		
		decorationContractPO.setAdditionalInfo(decorationContractVO.getAdditionalInfo());
		decorationContractPO.setEndTime(decorationContractVO.getEndTime());
		decorationContractPO.setStartTime(decorationContractVO.getStartTime());
		decorationContractPO.setDecorationPO(decorationPO);
		decorationContractPO.setContractCode(contractCode.toString());
		decorationContractPO.setWorkingDuration(decorationContractVO.getWorkingDuration());
		decorationContractPO.setTemplateHtml(SystemConfigDao.querySystemConfig("contractPath").getValue());
		decorationContractPO.setSignTime(DateUtil.getDateToTimestamp(new Date()));
	
		decorationContractDao.saveOrUpdate(decorationContractPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int signDecorationContract(DecorationContractVO decorationContractVO, Authentication authentication) throws FLException{
		
		List<Short> noUpdateStatus = Arrays.asList(new Short[]{DecorationPO.STATUS_SIGNED_INT, DecorationPO.STATUS_COMPLETED_INT, DecorationPO.STATUS_WASTE_INT, DecorationPO.STATUS_TERMINATION_INT}); // 已签约, 已完工, 废单, 合同终止
		String[] paymentStatus = new String[]{DecorationPaymentPO.PAYMENTSTATUS_PAY_STR,DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR};
		
		boolean resignFlag = false;
		String orderId = decorationContractVO.getOrderId();
		String userId = authentication.getUserId();
				
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(noUpdateStatus.contains(decorationPO.getStatus())){
			throw new FLException(140005, "订单合同不能修改");
		}
		
		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(decorationPO.getOrderId(),paymentStatus,DecorationPaymentPO.ONETYPE_ADD_INT,DecorationPaymentPO.TWOTYPE_DEAL_INT);		
		
		if(decorationPayments == null || decorationPayments.size() == 0){
			throw new FLException(140006, "订单没有进行款项交付,不能签订合同");
		}
		
		if(approvalDao.countApprovalForInitByIdent(orderId) > 0){
			throw new FLException(140037, "订单存在未处理审批项");
		}
		
		DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);
		
		if(decorationContractPO == null){
			decorationContractPO = new DecorationContractPO();
			decorationContractPO.setDecorationPO(decorationPO);
		}
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(quotationPO == null){
			throw new FLException(140008, "订单没有报价信息");
		}
		
		quotationDao.updateQuotationForStatusByOrderId(orderId, QuotationPO.STATUS_DISABLED_SHORT);
		
		if(DecorationPO.STATUS_RESIGNED_INT == decorationPO.getStatus()){
			resignFlag = true;
		}
		
		UserPO operater = userDao.queryUserByUserId(userId);
		
		decorationPO.setNetperfor(decorationContractVO.getNetperfor());
		decorationPO.setComperfor(decorationContractVO.getComperfor());
		decorationPO.setStatus(DecorationPO.STATUS_SIGNED_INT);
		decorationPO.setContractCode(decorationContractPO.getContractCode());
		decorationPO.setContracter(operater);
		
		List<DecorationBelongPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT);
		List<DecorationBelongPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
		
		if(!resignFlag){
			decorationPO.setContractTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		decorationDao.update(decorationPO);
		
		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
		decorationOperatePO.setOrderId(decorationPO.getOrderId());
		decorationOperatePO.setOperater(operater);
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setComment("签订合同");
		decorationOperatePO.setValue(decorationPO.getOrderTotalPrice());
		
		if(!resignFlag){
			
			//更新归属信息的部门和大区
			for(DecorationBelongPO orderBelongInfoPO: designerOrderBelongInfoPOs){
				orderBelongInfoPO.setDepartment(orderBelongInfoPO.getBelonger().getDept());
				orderBelongInfoPO.setRegion(orderBelongInfoPO.getBelonger().getDept().getFatherDept());
				
				orderBelongInfoDao.update(orderBelongInfoPO);
			}
			
			for(DecorationBelongPO orderBelongInfoPO: salemsanOrderBelongInfoPOs){
				orderBelongInfoPO.setDepartment(orderBelongInfoPO.getBelonger().getDept());
				orderBelongInfoPO.setRegion(orderBelongInfoPO.getBelonger().getDept().getFatherDept());
				
				orderBelongInfoDao.update(orderBelongInfoPO);
			}
			
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SIGN_DECORATION_ORDER_INT);
		}else{
			decorationOperatePO.setType(DecorationOperatePO.TYPE_SIGNED_DECORATION_ORDER_INT);
		}
		
		decorationOperateDao.save(decorationOperatePO);
		
		// 生成业务员对应设计师的合同额信息
		DecorationOperateServiceImpl.makeDecorationOperateForDecorationContract(decorationOperateDao, decorationPO, salemsanOrderBelongInfoPOs, designerOrderBelongInfoPOs, operater, decorationPO.getOrderTotalPrice(), 1, decorationOperatePO.getType());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {
		
		String orderId = decorationContractVO.getOrderId();
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(DecorationPO.STATUS_SIGNED_INT != (decorationPO.getStatus())){
			throw new FLException(140027, "订单状态不能重签合同");
		}
		
		if(approvalDao.countApprovalForInitByIdent(orderId) > 0){
			throw new FLException(140037, "订单存在未处理审批项");
		}
		
		if(addReduceDao.countAddReduceByOrderId(orderId)>0){
			throw new FLException(140041, "订单存在增减项,不能重新签单");
		}
		
		decorationPO.setStatus(DecorationPO.STATUS_RESIGNED_INT);
		
		decorationDao.update(decorationPO);
		
		UserPO operater = userDao.queryUserByUserId(userId);
		
		DecorationOperatePO decorationOperatePO = new DecorationOperatePO();
		decorationOperatePO.setOrderId(decorationPO.getOrderId());
		decorationOperatePO.setOperater(operater);
		decorationOperatePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationOperatePO.setType(DecorationOperatePO.TYPE_RESIGN_DECORATION_ORDER_INT);
		decorationOperatePO.setStatus(DecorationOperatePO.STATUS_INIT_INT);
		decorationOperatePO.setValue(-decorationPO.getOrderTotalPrice());
		
		decorationOperatePO.setComment("重签合同");
		
		decorationOperateDao.save(decorationOperatePO);
		
		List<DecorationBelongPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT);
		List<DecorationBelongPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
		
		DecorationOperateServiceImpl.makeDecorationOperateForDecorationContract(decorationOperateDao, decorationPO, salemsanOrderBelongInfoPOs, designerOrderBelongInfoPOs, operater, decorationPO.getOrderTotalPrice(), -1, decorationOperatePO.getType());
		
		return 0;
	}

}
