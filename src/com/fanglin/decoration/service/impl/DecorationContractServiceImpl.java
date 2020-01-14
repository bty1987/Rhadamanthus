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

import com.alibaba.fastjson.JSONObject;
import com.fadada.signature.Signature;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.communion.dao.ContractDao;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.SignetDao;
import com.fanglin.communion.po.ContractPO;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.SignetPO;
import com.fanglin.communion.vo.ContractVO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.SignetVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

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
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private DecorationOperateDao decorationOperateDao;

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private ContractDao contractDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private SignetDao signetDao;

	@Override
	public List<DecorationContractVO> queryDecorationContractByOrderId(DecorationContractVO decorationContract) throws FLException {

		List<DecorationContractPO> decorationContractPOs = decorationContractDao.queryDecorationContractByOrderId(decorationContract.getOrderId());
		List<DecorationContractVO> decorationContractVOs = new ArrayList<DecorationContractVO>();

		for (DecorationContractPO decorationContractPO : decorationContractPOs) {
			DecorationContractVO decorationContractVO = new DecorationContractVO(new ContractVO(), new UserBaseVO());

			BeanUtil.copyProperties(decorationContractPO, decorationContractVO, Arrays.asList("contract", "creater"));
			BeanUtil.copyProperties(decorationContractPO.getCreater(), decorationContractVO.getCreater(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(decorationContractPO.getContract(), decorationContractVO.getContract());

			decorationContractVOs.add(decorationContractVO);
		}

		return decorationContractVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationContract(DecorationContractVO decorationContract, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		DecorationContractPO decorationContractPO = new DecorationContractPO(new ContractPO(), new UserPO());

		BeanUtil.copyProperties(decorationContract, decorationContractPO, Arrays.asList("contract", "creater"));

		ContractPO contract = contractDao.get(decorationContract.getContract().getCid());

		decorationContractPO.setContract(contract);
		decorationContractPO.setCreater(creater);
		decorationContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationContractPO.setStatus(DecorationContractPO.STATUS_VALID_INT);

		decorationContractDao.save(decorationContractPO);

		JSONObject params = new JSONObject();
		params.put("customerName", "白添宇");
		params.put("customerName_1", "白添宇");

		Signature.generate(decorationContractPO, params);

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

		// DecorationContractPO decorationContractPO = decorationContractDao.queryDecorationContractByOrderId(orderId);
		//
		// if (decorationContractPO == null) {
		// decorationContractPO = new DecorationContractPO();
		// decorationContractPO.setOrderId(orderId);
		// }

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

		List<DecorationBelongPO> designerOrderBelongInfoPOs = decorationBelongDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT);
		List<DecorationBelongPO> salemsanOrderBelongInfoPOs = decorationBelongDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
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

				decorationBelongDao.update(decorationBelongPO);
			}

			for (DecorationBelongPO decorationBelongPO : salemsanOrderBelongInfoPOs) {
				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setSales(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				decorationBelongDao.update(decorationBelongPO);
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

		if (DecorationPO.STATUS_SIGNED_INT != (decorationPO.getStatus())) {// 判断装修单状态为3(签约), 其他状态不能重签
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

		// 重签处理过程 , 需要冲减之前计算的设计师/业务员业绩信息
		// List<DecorationBelongPO> designerOrderBelongInfoPOs = orderBelongInfoDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT);
		// List<DecorationBelongPO> salemsanOrderBelongInfoPOs = orderBelongInfoDao.queryDecorationBelongForCurrentByOrderIdAType(decorationContractVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT);
		// DecorationOperateServiceImpl.makeDecorationOperateForDecorationContract(decorationOperateDao, decorationPO, salemsanOrderBelongInfoPOs, designerOrderBelongInfoPOs, operater, decorationPO.getOrderTotalPrice(), -1, decorationOperatePO.getType());

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
	public int signDecorationContractForCompany(SignetVO signetVO, DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());
		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		Signature.autosign(signetPO, decorationContractPO);

		return 0;
	}

	@Override
	public String signDecorationContractForCustomer(DecorationContractVO decorationContractVO, CustomerVO customerVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());
		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		return Signature.extsign(customerPO, decorationContractPO);
	}

	@Override
	public String viewDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		return Signature.view(decorationContractPO);
	}

	@Override
	public int fillingDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		Signature.filing(decorationContractPO);

		return 0;
	}

}
