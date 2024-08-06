package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.ContractDao;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.data.po.ContractPO;
import com.fanglin.data.po.SignetPO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.fadada.signature.Signature;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
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
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private SignetDao signetDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Override
	public List<DecorationContractVO> queryDecorationContractByOrderId(DecorationContractVO decorationContract) throws FLException {

		List<DecorationContractPO> decorationContractPOs = decorationContractDao.queryDecorationContractByOrderId(decorationContract.getOrderId());
		List<DecorationContractVO> decorationContractVOs = new ArrayList<DecorationContractVO>();

		for (DecorationContractPO decorationContractPO : decorationContractPOs) {
			DecorationContractVO decorationContractVO = new DecorationContractVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(decorationContractPO, decorationContractVO, Arrays.asList("contract", "creater", "signner", "filinner"));
			BeanUtil.copyProperties(decorationContractPO.getCreater(), decorationContractVO.getCreater(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(decorationContractPO.getSignner(), decorationContractVO.getSignner(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(decorationContractPO.getFilinner(), decorationContractVO.getFilinner(), Arrays.asList("dept", "duty"));

			decorationContractVOs.add(decorationContractVO);
		}

		return decorationContractVOs;
	}

	@Override
	public String viewDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		return Signature.view(decorationContractPO);
	}

	@Override
	public void sendDecorationContractForAuth(DecorationContractVO decorationContractVO) throws FLException {

		String orderId = decorationContractVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, 客户认证.", orderId), decorationPO.getCustomer().getAuthurl());
	}

	@Override
	public void sendDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		String orderId = decorationContractPO.getOrderId();

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, 合同信息.", orderId), String.format("%s/views/contract/redirect.html?dcid=%d&type=%d", isv.getValue(), decorationContractPO.getDcid(), decorationContractVO.getType()));
	}

	@Override
	public String redirectDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		String orderId = decorationContractPO.getOrderId();
		String url = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		short type = decorationContractVO.getType();
		short status = decorationContractPO.getStatus();

		if (type == DecorationContractPO.TYPE_SIGNET_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
			url = String.format("%s/signature.html?cid=%d", isv.getValue(), decorationPO.getCustomer().getCid());
		} else if (type == DecorationContractPO.TYPE_SIGN_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			url = Signature.extsign(decorationPO.getCustomer().getSignno(), decorationContractPO);
		} else if (type == DecorationContractPO.TYPE_VIEW_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			url = decorationContractPO.getViewpdf();
		} else if (type == DecorationContractPO.TYPE_DOWNLOAD_INT && status == DecorationContractPO.STATUS_SIGN_INT) {
			url = decorationContractPO.getDownload();
		} else {
			throw new FLException(130028, "合同状态不可操作");
		}

		return url;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationContract(DecorationContractVO decorationContractVO, ContractVO contractVO, String data, String table, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		DecorationContractPO decorationContractPO = new DecorationContractPO(new UserPO());

		BeanUtil.copyProperties(decorationContractVO, decorationContractPO, Arrays.asList("creater"));

		ContractPO contractPO = contractDao.get(contractVO.getCid());

		decorationContractPO.setCid(contractPO.getCid());
		decorationContractPO.setNo(contractPO.getNo());
		decorationContractPO.setName(contractPO.getName());
		decorationContractPO.setTitle(contractPO.getTitle());
		decorationContractPO.setCreater(creater);
		decorationContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationContractPO.setStatus(DecorationContractPO.STATUS_VALID_INT);

		decorationContractDao.save(decorationContractPO);

		JSONObject params = JSONObject.parseObject(data);

		JSONArray tables = JSON.parseArray(table);

		Signature.generate(decorationContractPO, params, tables);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String signDecorationContractForCompany(SignetVO signetVO, DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		Signature.autosign(signetPO.getSignno(), signetPO.getKeyword(), decorationContractPO, signetPO.getSignid());

		decorationContractPO.setComsignTime(DateUtil.getDateToTimestamp(new Date()));

		decorationContractDao.update(decorationContractPO);

		return "";
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

		return Signature.extsign(customerPO.getSignno(), decorationContractPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affixDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		UserPO signner = userDao.queryUserByUserId(userId);

		decorationContractPO.setSignner(signner);
		decorationContractPO.setStatus(DecorationContractPO.STATUS_SIGN_INT);
		decorationContractPO.setCussignTime(DateUtil.getDateToTimestamp(new Date()));

		decorationContractDao.update(decorationContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expireDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		decorationContractPO.setStatus(DecorationContractPO.STATUS_NULL_INT);

		decorationContractDao.update(decorationContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int filingDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_SIGN_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		Signature.filing(decorationContractPO);

		UserPO filinner = userDao.queryUserByUserId(userId);

		decorationContractPO.setFilinner(filinner);
		decorationContractPO.setStatus(DecorationContractPO.STATUS_FILE_INT);
		decorationContractPO.setFilingTime(DateUtil.getDateToTimestamp(new Date()));

		decorationContractDao.update(decorationContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int showDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(130002, "合同信息不存在");
		}

		decorationContractPO.setIshow(decorationContractVO.getIshow());

		decorationContractDao.update(decorationContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int signDecorationContract(DecorationVO decorationVO, Authentication authentication) throws FLException {

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		boolean resignFlag = false;
		boolean prosignFlag = false;

		String orderId = decorationVO.getOrderId();
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

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(140008, "订单没有报价信息");
		}

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionInfoPO.getKeyTime() == null) {
			throw new FLException(120031, "未配置预计领取钥匙时间");
		}

		if (constructionInfoPO.getDrawlineTime() == null) {
			throw new FLException(120032, "未配置预计放线时间");
		}

		quotationDao.updateQuotationForStatusByOrderId(orderId, QuotationPO.STATUS_LOCK_INT);

		if (DecorationPO.STATUS_RESIGNED_INT == decorationPO.getStatus()) {
			resignFlag = true;
		}

		if (DecorationPO.STATUS_PROSIGN_INT == decorationPO.getStatus()) {
			prosignFlag = true;
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationPO.setStatus(DecorationPO.STATUS_SIGNED_INT);
		decorationPO.setContracter(operater);

		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(decorationVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(decorationVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (decorationPO.getDesignStatus() == DecorationPO.DESIGNSTATUS_INITIA_INT) {
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_CONDUCT_INT);
		}

		if (!resignFlag) {
			decorationPO.setContractTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (decorationVO.getConpany() != null) {
			decorationPO.setConpany(CompanyServiceImpl.decode(decorationVO.getDompany()));
		}

		decorationDao.update(decorationPO);

		if (!resignFlag && !prosignFlag) { // 签约

			decorationAdditionPO.clearDesign();
			decorationAdditionPO.clearSales();

			// 更新归属信息的部门和大区, 更新附加信息
			for (DecorationBelongPO decorationBelongPO : designers) {

				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setDesign(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				decorationBelongDao.update(decorationBelongPO);

				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_DESIGN_INT, decorationBelongPO.getRate()));
			}

			for (DecorationBelongPO decorationBelongPO : salesmans) {

				decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
				decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

				decorationAdditionPO.setSales(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

				decorationBelongDao.update(decorationBelongPO);

				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_BUSINESS_INT, decorationBelongPO.getRate()));
			}

			decorationAdditionDao.update(decorationAdditionPO);

		} else {

			for (DecorationBelongPO decorationBelongPO : designers) {
				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_DESIGN_INT, decorationBelongPO.getRate()));
			}

			for (DecorationBelongPO decorationBelongPO : salesmans) {
				decorationOperateDao.save(new DecorationOperatePO().sign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_BUSINESS_INT, decorationBelongPO.getRate()));
			}
		}

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

		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		for (DecorationBelongPO decorationBelongPO : designers) {
			decorationOperateDao.save(new DecorationOperatePO().resign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_DESIGN_INT, decorationBelongPO.getRate()));
		}

		for (DecorationBelongPO decorationBelongPO : salesmans) {
			decorationOperateDao.save(new DecorationOperatePO().resign(orderId, operater, decorationPO.getOrderTotalPrice()).belong(decorationBelongPO.getBelonger().getUid(), decorationBelongPO.getBelonger().getDept().getDid(), decorationBelongPO.getBelonger().getDept().getFatherDept().getDid(), DecorationOperatePO.ATTTYPE_BUSINESS_INT, decorationBelongPO.getRate()));
		}

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

		if (decorationActivityDao.countDecorationActivity(orderId, null) == 0) {
			throw new FLException(140033, "订单活动信息不存在");
		}

		if (decorationActivityDao.countDecorationActivity(orderId, DecorationActivityPO.STATUS_INIT_INT) > 0) {
			throw new FLException(140060, "活动未锁定");
		}

		ProtationPO protationPO = protationDao.queryProtationForDefaultByOrderId(orderId);

		if (protationPO == null) {
			throw new FLException(200046, "预签不存在");
		}

		if (protationPO.getStatus() != ProtationPO.STATUS_LOCK_INT) {
			throw new FLException(200047, "预签不可操作");
		}

		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		decorationAdditionPO.clearDesign();
		decorationAdditionPO.clearSales();

		// 更新归属信息的部门和大区, 更新附加信息
		for (DecorationBelongPO decorationBelongPO : designers) {

			decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
			decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

			decorationAdditionPO.setDesign(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

			decorationBelongDao.update(decorationBelongPO);
		}

		for (DecorationBelongPO decorationBelongPO : salesmans) {

			decorationBelongPO.setDepartment(decorationBelongPO.getBelonger().getDept());
			decorationBelongPO.setRegion(decorationBelongPO.getBelonger().getDept().getFatherDept());

			decorationAdditionPO.setSales(decorationBelongPO.getBelonger().getCurrentName(), decorationBelongPO.getBelonger().getDept().getName(), decorationBelongPO.getBelonger().getDept().getFatherDept().getName());

			decorationBelongDao.update(decorationBelongPO);
		}

		decorationAdditionDao.update(decorationAdditionPO);

		long couponCut = decorationActivityItemDao.amountDecorationActivityItemForIsPayment(orderId, DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		decorationPO.setPrecontractPrice(Arith.sub(protationPO.getTotalPrice(), couponCut));
		decorationPO.setPrecontractTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setStatus(DecorationPO.STATUS_PROSIGN_INT); // 预签

		decorationDao.update(decorationPO);

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationOperateDao.save(new DecorationOperatePO().prosign(orderId, operater)); // 创建装修单操作信息

		return 0;
	}

}
