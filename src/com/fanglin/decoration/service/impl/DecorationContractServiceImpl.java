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
import com.fanglin.communion.po.DepartmentTypePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.customer.po.CustomerUserRuleItemPO;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.ContractDao;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.data.po.ContractPO;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.data.po.SignetPO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.dao.DecorationContractRecordDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationAccountStatusPO;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.decoration.po.DecorationContractRecordPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountStatusService;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.enums.ElecsignScene;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
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
	private ElecsignRouter elecsignRouter;
	@Autowired
	private CustomerChanceDao customerChanceDao;
	@Autowired
	private com.fanglin.elecsign.dao.ElecsignAuthDao elecsignAuthDao;
	@Autowired
	private com.fanglin.system.dao.CompanyDao companyDao;

	@Autowired
	private DecorationContractDao decorationContractDao;

	@Autowired
	private DecorationContractRecordDao decorationContractRecordDao;

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
	private DecorationAccountStatusService decorationAccountStatusService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private CustomerUserRuleDao customerUserRuleDao;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Autowired
	private MessageService messageService;

	@Override
	public List<DecorationContractVO> queryDecorationContractByOrderId(DecorationContractVO decorationContract) throws FLException {

		List<DecorationContractPO> decorationContractPOs = decorationContractDao.queryDecorationContractByOrderId(decorationContract.getOrderId());
		List<DecorationContractVO> decorationContractVOs = new ArrayList<DecorationContractVO>();

		for (DecorationContractPO decorationContractPO : decorationContractPOs) {
			decorationContractVOs.add(decorationContractPO.ptv(new DecorationContractVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO())));
		}

		return decorationContractVOs;
	}

	@Override
	public String viewDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		return routeForRecord(decorationContractPO).view(decorationContractPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendDecorationContractForAuth(DecorationContractVO decorationContractVO) throws FLException {

		String orderId = decorationContractVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, 客户认证.", orderId), decorationPO.getCustomer().getAuthurl());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		String orderId = decorationContractPO.getOrderId();

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, 合同信息.", orderId), String.format("%s/views/contract/redirect.html?dcid=%d&type=%d", isv.getValue(), decorationContractPO.getDcid(), decorationContractVO.getType()));
	}

	@Override
	public String redirectDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		String orderId = decorationContractPO.getOrderId();
		String url = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		short type = decorationContractVO.getType();
		short status = decorationContractPO.getStatus();

		if (type == DecorationContractPO.TYPE_SIGNET_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
			url = String.format("%s/signature.html?cid=%d&name=%s", isv.getValue(), decorationPO.getCustomer().getCid(), decorationPO.getCustomer().getName());
		} else if (type == DecorationContractPO.TYPE_SIGN_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			// 单流合流: 带企业侧账号——e签宝已建流直接取链接, 未建流补建双方流; 法大大忽略企业侧信息行为不变
			short provider = decorationContractPO.getProvider() == null ? ElecsignProvider.FADADA.code() : decorationContractPO.getProvider();
			SignetPO companySignet = querySignetForProvider(decorationPO.getCompany(), provider);
			url = routeForRecord(decorationContractPO).extsignBoth(decorationPO.getCustomer().getSignno(), decorationContractPO, companySignet == null ? null : companySignet.getSignno(), companySignet == null ? null : companySignet.getKeyword());
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

		ContractPO contractPO = contractDao.get(contractVO.getCid());

		if (contractPO == null) {
			throw new FLException(130044, "合同模版不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		// 判断是否为第一份合同
		List<DecorationContractPO> existingContracts = decorationContractDao.queryDecorationContractByOrderId(decorationContractVO.getOrderId());
		boolean isFirstContract = (existingContracts == null || existingContracts.isEmpty());

		DecorationContractPO decorationContractPO = new DecorationContractPO(new UserPO());

		BeanUtil.copyProperties(decorationContractVO, decorationContractPO, Arrays.asList("creater"));

		decorationContractPO.setCid(contractPO.getCid());
		decorationContractPO.setNo(contractPO.getNo());
		decorationContractPO.setName(contractPO.getName());
		decorationContractPO.setTitle(contractPO.getTitle());
		decorationContractPO.setCreater(creater);
		decorationContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationContractPO.setStatus(DecorationContractPO.STATUS_VALID_INT);
		decorationContractPO.setNoticeStatus(DecorationContractPO.NOTICE_STATUS_UNCONFIRMED_INT);

		decorationContractDao.save(decorationContractPO);

		// 如果是第一份合同，创建合同记录
		if (isFirstContract) {
			DecorationContractRecordPO recordPO = new DecorationContractRecordPO();
			recordPO.setOrderId(decorationContractVO.getOrderId());
			recordPO.setCommitTime(DateUtil.getDateToTimestamp(new Date()));
			// startTime, endTime, comment 需要通过其他方式设置
			recordPO.setStartTime(null);
			recordPO.setEndTime(null);
			recordPO.setComment(null);
			decorationContractRecordDao.save(recordPO);
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationContractVO.getOrderId());

		JSONObject params = JSONObject.parseObject(data);

		// 流程模板路线上下文(e签宝 signTemplate 发起需要签署人信息):
		// 仅e签宝模板行(esign://前缀)塞入——法大大/文档模板行的params保持原样透传(历史行为零变化);
		// 个人方=装修单客户, 企业方=签章主体(装修单公司)
		boolean esignTemplateRow = contractPO.getPath() != null && contractPO.getPath().startsWith("esign://");

		if (esignTemplateRow && decorationPO != null && decorationPO.getCustomer() != null && params != null) {

			com.fanglin.communion.po.CustomerPO flowCustomer = decorationPO.getCustomer();

			try {
				params.put("_flow_psnName", flowCustomer.getName());
				params.put("_flow_psnPhone", com.fanglin.core.security.SensitiveDataHelper.decrypt(flowCustomer.getPhone()));
			} catch (Exception e) {
				throw new FLException(130097, "客户信息缺失, 无法发起电子签流程");
			}

			if (decorationPO.getCompany() > 0) {
				com.fanglin.system.po.CompanyPO flowCompany = companyDao.get(decorationPO.getCompany());
				if (flowCompany != null && flowCompany.getFullname() != null && !flowCompany.getFullname().trim().isEmpty()) {
					params.put("_flow_orgName", flowCompany.getFullname());
				}

				// 签章主体: 取公司e签宝已认证签章(签章表=主体登记处)——orgId(signno)与实名主体全称(keyword)成对塞入,
				// 建流企业参与方优先orgName+经办人手机(e签宝实测配对规则: orgName配transactorPsnAccount/orgId配transactorPsnId, 不可交叉)
				SignetPO flowSignet = queryConfirmedSignetForProvider(decorationPO.getCompany(), ElecsignProvider.ESIGN.code());

				if (flowSignet != null) {
					if (flowSignet.getKeyword() != null && !flowSignet.getKeyword().trim().isEmpty()) {
						params.put("_flow_orgName", flowSignet.getKeyword().trim());
					}
					if (flowSignet.getSignno() != null && !flowSignet.getSignno().trim().isEmpty()) {
						params.put("_flow_orgId", flowSignet.getSignno().trim());
					}
				}
			}

			if (creater != null) {
				params.put("_flow_transactorName", creater.getUserName());
				try {
					params.put("_flow_transactorPhone", creater.getPhone() == null ? null : com.fanglin.core.security.SensitiveDataHelper.decrypt(creater.getPhone()));
				} catch (Exception e) {
					params.put("_flow_transactorPhone", null);
				}
			}
		}

		JSONArray tables = JSON.parseArray(table);

		routeForCreate(decorationContractPO, contractPO.getCompany(), contractPO.getPath()).generate(decorationContractPO, params, tables);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationContract(DecorationContractVO decorationContractVO, String data, String table, String userId) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		ContractPO contractPO = contractDao.get(decorationContractPO.getCid());

		if (contractPO == null) {
			throw new FLException(130044, "合同模版不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_UNMAKE_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		BeanUtil.copyProperties(decorationContractVO, decorationContractPO, Arrays.asList("creater"));

		decorationContractPO.setCid(contractPO.getCid());
		decorationContractPO.setNo(contractPO.getNo());
		decorationContractPO.setName(contractPO.getName());
		decorationContractPO.setTitle(contractPO.getTitle());
		decorationContractPO.setCreater(creater);
		decorationContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationContractPO.setStatus(DecorationContractPO.STATUS_VALID_INT);
		decorationContractPO.setNoticeStatus(DecorationContractPO.NOTICE_STATUS_UNCONFIRMED_INT);

		decorationContractDao.save(decorationContractPO);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationContractPO.getOrderId());

		JSONObject params = JSONObject.parseObject(data);

		// 流程模板路线上下文: 仅e签宝模板行(esign://前缀)塞入, 法大大/文档模板行params保持原样
		boolean esignTemplateRow = contractPO.getPath() != null && contractPO.getPath().startsWith("esign://");

		if (esignTemplateRow && decorationPO != null && decorationPO.getCustomer() != null && params != null) {

			com.fanglin.communion.po.CustomerPO flowCustomer = decorationPO.getCustomer();

			try {
				params.put("_flow_psnName", flowCustomer.getName());
				params.put("_flow_psnPhone", com.fanglin.core.security.SensitiveDataHelper.decrypt(flowCustomer.getPhone()));
			} catch (Exception e) {
				throw new FLException(130097, "客户信息缺失, 无法发起电子签流程");
			}

			if (decorationPO.getCompany() > 0) {
				com.fanglin.system.po.CompanyPO flowCompany = companyDao.get(decorationPO.getCompany());
				if (flowCompany != null && flowCompany.getFullname() != null && !flowCompany.getFullname().trim().isEmpty()) {
					params.put("_flow_orgName", flowCompany.getFullname());
				}

				// 签章主体: 取公司e签宝已认证签章(签章表=主体登记处)——orgId(signno)与实名主体全称(keyword)成对塞入,
				// 建流企业参与方优先orgName+经办人手机(e签宝实测配对规则: orgName配transactorPsnAccount/orgId配transactorPsnId, 不可交叉)
				SignetPO flowSignet = queryConfirmedSignetForProvider(decorationPO.getCompany(), ElecsignProvider.ESIGN.code());

				if (flowSignet != null) {
					if (flowSignet.getKeyword() != null && !flowSignet.getKeyword().trim().isEmpty()) {
						params.put("_flow_orgName", flowSignet.getKeyword().trim());
					}
					if (flowSignet.getSignno() != null && !flowSignet.getSignno().trim().isEmpty()) {
						params.put("_flow_orgId", flowSignet.getSignno().trim());
					}
				}
			}

			if (creater != null) {
				params.put("_flow_transactorName", creater.getUserName());
				try {
					params.put("_flow_transactorPhone", creater.getPhone() == null ? null : com.fanglin.core.security.SensitiveDataHelper.decrypt(creater.getPhone()));
				} catch (Exception e) {
					params.put("_flow_transactorPhone", null);
				}
			}
		}

		JSONArray tables = JSON.parseArray(table);

		routeForCreate(decorationContractPO, contractPO.getCompany(), contractPO.getPath()).generate(decorationContractPO, params, tables);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String signDecorationContractForCompany(SignetVO signetVO, DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationContractPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		short provider = decorationContractPO.getProvider() == null ? ElecsignProvider.FADADA.code() : decorationContractPO.getProvider();

		if (provider == ElecsignProvider.ESIGN.code()) {

			// 流程模板路线: 签署流程已在合同生成时发起(create-by-sign-template),
			// 公司签=返回经办人签署链接——企业已授权自动签的平台发起时已自动落章(链接打开显示已完成),
			// 未授权企业由经办人经此链接H5手动落章; comsignTime由签署完成回调推进; 不需要ERP签章
			return routeForRecord(decorationContractPO).transactorSignUrl(decorationContractPO);
		}

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (signetPO == null) {
			// sid 未传时（app端）自动取合同所属公司的签章：唯一则直接使用，否则报错引导网页端选择
			List<SignetPO> signetPOs = signetDao.querySignet(null, decorationPO.getCompany());

			if (signetPOs == null || signetPOs.isEmpty()) {
				throw new FLException(130045, "该公司未维护有效签章, 请先维护");
			}

			if (signetPOs.size() > 1) {
				throw new FLException(130045, "该公司存在多个签章, 请在网页端选择签章签署");
			}

			signetPO = signetPOs.get(0);
		}

		// 法大大: 单流合流建流+落章, 企业签行为与原先完全一致
		String psnSignno = resolveCustomerSignno((int) decorationPO.getCustomer().getCid(), provider);

		routeForRecord(decorationContractPO).autosignBoth(signetPO.getSignno(), signetPO.getKeyword(), decorationContractPO, signetPO.getSignid(), psnSignno);

		decorationContractPO.setComsignTime(DateUtil.getDateToTimestamp(new Date()));

		decorationContractDao.update(decorationContractPO);

		return "";
	}

	@Override
	public String signDecorationContractForCustomer(DecorationContractVO decorationContractVO, CustomerVO customerVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_VALID_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		// 按合同厂商取客户认证账号: elecsignauth 行优先(按厂商各一份, 切换签约方式互不覆盖),
		// 无行/新表不可用回退 customer.signno 同命名空间存量值; 两处皆无 → 130189 引导按合同厂商重实名
		short provider = decorationContractPO.getProvider() == null ? ElecsignProvider.FADADA.code() : decorationContractPO.getProvider();

		String signno = resolveCustomerSignno((int) customerPO.getCid(), provider);

		if (signno == null || "".equals(signno)) {
			throw new FLException(130189, "客户实名认证未完成, 请先发起实名认证");
		}

		// 单流合流: 带企业侧账号——e签宝已建流(企业签先行)直接取签署链接, 未建流补建双方流(无签章由实现侧引导先企业签);
		// 法大大忽略企业侧信息, 行为与原先完全一致
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationContractPO.getOrderId());
		SignetPO companySignet = decorationPO == null ? null : querySignetForProvider(decorationPO.getCompany(), provider);

		return routeForRecord(decorationContractPO).extsignBoth(signno, decorationContractPO, companySignet == null ? null : companySignet.getSignno(), companySignet == null ? null : companySignet.getKeyword());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affixDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
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
	public int noticeDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
		}

		// 更新通知确认状态为已确认 (1表示已确认)
		decorationContractPO.setNoticeStatus((short) 1);
		decorationContractDao.update(decorationContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expireDecorationContract(DecorationContractVO decorationContractVO) throws FLException {

		DecorationContractPO decorationContractPO = decorationContractDao.get(decorationContractVO.getDcid());

		if (decorationContractPO == null) {
			throw new FLException(140067, "合同不存在");
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
			throw new FLException(140067, "合同不存在");
		}

		if (decorationContractPO.getStatus() != DecorationContractPO.STATUS_SIGN_INT) {
			throw new FLException(130028, "合同状态不可操作");
		}

		routeForRecord(decorationContractPO).filing(decorationContractPO);

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
			throw new FLException(140067, "合同不存在");
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
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140005, "订单合同不能修改");
		}

		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

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
			// throw new FLException(120031, "未配置预计领取钥匙时间");
		}

		if (constructionInfoPO.getDrawlineTime() == null) {
			throw new FLException(120032, "未配置预计放线时间");
		}

		quotationDao.updateQuotationForStatusByOrderId(orderId, QuotationPO.STATUS_LOCK_INT);

		UserPO operater = userDao.queryUserByUserId(userId);

		DecorationBusitypePO decorationBusitypePO = decorationPO.getBusitype();
		CustomerUserRulePO customerUserRulePO = null;

		if (decorationBusitypePO.getIsAward() == DecorationBusitypePO.ISAWARD_AWARD_INT) {

			customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(decorationPO.getDesigner().getUid());

			if (customerUserRulePO == null) {
				customerUserRulePO = new CustomerUserRulePO().init(decorationPO.getDesigner(), operater, decorationPO.getCompany());

				customerUserRuleDao.save(customerUserRulePO);
			}
		}

		if (decorationBusitypePO.getIsAward() == DecorationBusitypePO.ISAWARD_AWARD_DEPT_INT) {

			UserPO manager = decorationPO.getDesigner().getDept() != null ? decorationPO.getDesigner().getDept().getManager() : null;

			if (manager != null) {

				customerUserRulePO = customerUserRuleDao.queryCustomerUserRule(manager.getUid());

				if (customerUserRulePO == null) {
					customerUserRulePO = new CustomerUserRulePO().init(manager, operater, decorationPO.getCompany());

					customerUserRuleDao.save(customerUserRulePO);
				}
			}
		}

		if (customerUserRulePO != null) {
			customerUserRuleDao.save(new CustomerUserRuleItemPO().award(decorationPO.getOrderId(), customerUserRulePO.getCurid(), "工程部", new DepartmentTypePO(DepartmentTypePO.DEPARTMENT_TYPE_CONSTRUCTION_DEPT_INT)));
		}

		if (DecorationPO.STATUS_RESIGNED_INT == decorationPO.getStatus()) {
			resignFlag = true;
		}

		if (DecorationPO.STATUS_PROSIGN_INT == decorationPO.getStatus()) {
			prosignFlag = true;
		}

		decorationPO.setStatus(DecorationPO.STATUS_SIGNED_INT);
		decorationPO.setContracter(operater);

		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(decorationVO.getOrderId(), DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(decorationVO.getOrderId(), DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (decorationPO.getDesignStatus() == DecorationPO.DESIGNSTATUS_INITIA_INT) {
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_CONDUCT_INT);
			messageService.sendMessage(decorationPO.getDesigner().getUserId(), null, String.format("装修单: %s , 地址: %s %s , 合同签署完成 , 设计状态已进入设计中 , 请持续关注设计推进 .", orderId, decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber()), MessagePO.TYPE_SEND_PERSONEL_INT, decorationPO.getDesigner().getCompany());
		}

		if (!resignFlag) {
			decorationPO.setContractTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (decorationVO.getConpany() != null) {
			decorationPO.setConpany(CompanyServiceImpl.decode(decorationVO.getDompany()));
		}

		decorationDao.update(decorationPO);

		decorationAccountStatusService.updateDecorationAccountStatus(orderId, DecorationAccountStatusPO.TYPE_SIGN_INT);

		constructionInfoPO.setInitDesignTime(DateUtil.getDateToTimestamp(new Date()));

		constructionInfoDao.update(constructionInfoPO);

		if (!resignFlag && !prosignFlag) { // 签约

			decorationAdditionPO.clearDesign();
			decorationAdditionPO.clearSales();

			decorationPO.setDesignDept(decorationPO.getDesigner().getDept());
			decorationPO.setSalesDept(decorationPO.getSalesman().getDept());

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

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "signDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_SIGNED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "signDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_SIGNED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException {

		String orderId = decorationContractVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
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
		decorationPO.setRecontractTime(DateUtil.getDateToTimestamp(new Date()));

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

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "resignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "resignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int presignDecorationContract(DecorationVO decorationVO, String userId) throws FLException {

		String orderId = decorationVO.getOrderId();
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
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
			throw new FLException(200047, "预签状态不可操作");
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

		long couponCut = decorationActivityItemDao.amountDecorationActivityItem(orderId, DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		decorationPO.setPrecontractPrice(Arith.sub(protationPO.getTotalPrice(), couponCut));
		decorationPO.setPrecontractTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setStatus(DecorationPO.STATUS_PROSIGN_INT); // 预签

		decorationDao.update(decorationPO);

		UserPO operater = userDao.queryUserByUserId(userId);

		decorationOperateDao.save(new DecorationOperatePO().prosign(orderId, operater)); // 创建装修单操作信息

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "presignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "presignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));

		return 0;
	}

	private String buildCcidArgs(String orderId) {

		if (orderId == null) return "";

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);

		return customerChancePO != null ? ",\"ccid\":" + customerChancePO.getCcid() : "";
	}

	/** 电子签路由（生成/上传：重签按记录厂商，新建按 订单级→模板级→公司级 多层解析并记录厂商到合同 provider 字段） */
	private ElecsignService routeForCreate(DecorationContractPO decorationContractPO, int company, String templatePath) throws FLException {

		if (decorationContractPO.getProvider() != null) {
			return elecsignRouter.route(decorationContractPO.getProvider(), company);
		}

		ElecsignProvider provider = elecsignRouter.resolveProvider(company, ElecsignScene.DECORATION, templatePath, decorationContractPO.getOrderId());

		decorationContractPO.setProvider(provider.code());

		// 🔴必须带公司绑定: route(provider)单例按company=0读凭证与配置, esign.orgid.{company}探测/凭证全落空(新合同分支曾漏绑,流程模板路线必Route A失败)
		return elecsignRouter.route(provider, company);
	}

	/** 电子签路由（签署/查看/归档：按合同记录的厂商路由，保证全链路厂商一致与历史可回溯；null 视同法大大） */
	/**
	 * 按厂商解析客户电子签账号(法大大customerId/e签宝psnId): elecsignauth 认证行优先; 无行/表不可用回退 customer.signno 同命名空间存量值; 两处皆无返回 null。 Dao 层方法支撑, 独立CustomerService调用。
	 */
	private String resolveCustomerSignno(int cid, short provider) {

		try {
			com.fanglin.elecsign.po.ElecsignAuthPO authPO = elecsignAuthDao.queryElecsignAuthByCidAndProvider(cid, provider);

			if (authPO != null && authPO.getSignno() != null && !authPO.getSignno().trim().isEmpty()) {
				return authPO.getSignno();
			}
		} catch (Exception e) {
			// 认证行不可用(新表未建等)走 customer 回退
		}

		com.fanglin.communion.po.CustomerPO customerPO = customerDao.get((long) cid);

		if (customerPO == null) {
			return null;
		}

		short current = customerPO.getProvider() == null ? com.fanglin.elecsign.enums.ElecsignProvider.FADADA.code() : customerPO.getProvider().shortValue();

		if (current == provider && customerPO.getSignno() != null && !customerPO.getSignno().trim().isEmpty()) {
			return customerPO.getSignno();
		}

		return null;
	}

	private ElecsignService routeForRecord(DecorationContractPO decorationContractPO) throws FLException {
		return elecsignRouter.route(decorationContractPO.getProvider());
	}

	/**
	 * 按厂商取公司签章（单流合流建流用，best-effort）：优先厂商匹配，无匹配且仅一枚时取该枚。
	 * 
	 * @return 未维护签章返回 null
	 */
	/** 公司指定厂商已认证签章(签章表=主体登记处: signno=e签宝orgId, keyword=实名主体全称): 多把时取sid最大(最近认证), 无已认证章返回null */
	private SignetPO queryConfirmedSignetForProvider(int company, short provider) {

		List<SignetPO> signetPOs = signetDao.querySignet(null, company);

		SignetPO latest = null;

		for (SignetPO signetPO : signetPOs == null ? new ArrayList<SignetPO>() : signetPOs) {

			if (signetPO.getProvider() == null || signetPO.getProvider().shortValue() != provider) {
				continue;
			}

			if (signetPO.getStatus() != SignetPO.STATUS_CONFIRM_INT) {
				continue;
			}

			if (signetPO.getSignno() == null || signetPO.getSignno().trim().isEmpty()) {
				continue;
			}

			if (latest == null || signetPO.getSid() > latest.getSid()) {
				latest = signetPO;
			}
		}

		return latest;
	}

	private SignetPO querySignetForProvider(int company, short provider) {

		List<SignetPO> signetPOs = signetDao.querySignet(null, company);

		if (signetPOs == null || signetPOs.isEmpty()) {
			return null;
		}

		for (SignetPO signetPO : signetPOs) {
			if (signetPO.getProvider() != null && signetPO.getProvider().shortValue() == provider) {
				return signetPO;
			}
		}

		return signetPOs.size() == 1 ? signetPOs.get(0) : null;
	}

}
