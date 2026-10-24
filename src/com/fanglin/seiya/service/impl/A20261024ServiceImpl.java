/**
 * @File Name		: A20261024ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-10-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: NERP预签同步服务实现
 */

package com.fanglin.seiya.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.PresignProduceDao;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.seiya.service.A20261024Service;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("a20261024Service")
@Transactional(readOnly = true)
public class A20261024ServiceImpl implements A20261024Service {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ProtationDao protationDao;

	@Autowired
	private DecorationBelongDao decorationBelongDao;

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private DecorationOperateDao decorationOperateDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Autowired
	private CustomerChanceDao customerChanceDao;

	@Autowired
	private PresignProduceDao presignProduceDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Object> syncProsignForNerp(String orderId, ProtationVO protation, Long qvid, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT });

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		if (operater == null) {
			throw new FLException(400040, "操作账号无效");
		}

		// 预签产品挂接校验（>0 时须存在, 防垃圾外键）
		Long ppid = protation.getPpid();

		if (ppid != null && ppid.longValue() > 0 && presignProduceDao.get(ppid.longValue()) == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		// 报价版本挂接校验（>0 时须存在, 防垃圾外键）
		QuotationVersionPO versionPO = null;

		if (qvid != null && qvid.longValue() > 0) {
			versionPO = quotationVersionDao.get(qvid.longValue());

			if (versionPO == null) {
				throw new FLException(200050, "报价版本不存在");
			}
		}

		if (protationDao.queryProtationForDefaultByOrderId(orderId) != null) {
			throw new FLException(400044, "预签单已存在");
		}

		long precontractPrice = protation.getTotalPrice() == null ? 0 : protation.getTotalPrice().longValue();

		if (protation.getName() == null || protation.getName().trim().isEmpty()) {
			protation.setName("预签单");
		}

		if (protation.getQuotePrice() == null) {
			protation.setQuotePrice(protation.getTotalPrice());
		}

		// 凭空创建无明细的锁定预签单（业务字段按VO回填, 未传字段保持PO缺省0; 明细不生成）
		ProtationPO protationPO = new ProtationPO();

		BeanUtil.copyPropertie(protation, protationPO, Arrays.asList("pid", "orderId", "createTime", "creater", "version", "status", "defaults", "decoration"));

		protationPO.setOrderId(orderId);

		if (ppid == null || ppid.longValue() <= 0) {
			protationPO.setPpid(0);
		}

		protationPO.setCreater(operater);
		protationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		protationPO.setStatus(ProtationPO.STATUS_LOCK_INT);
		protationPO.setDefaults(ProtationPO.DEFAULT_DEFAULT_INT);

		if (versionPO != null) {
			protationPO.setVersion(versionPO);
		}

		protationDao.save(protationPO);

		// 更新归属信息的部门和大区, 更新附加信息（同 presignDecorationContract）
		List<DecorationBelongPO> designers = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_DESIGN_INT, DecorationBelongPO.STATUS_INVALID_INT);
		List<DecorationBelongPO> salesmans = decorationBelongDao.queryDecorationBelong(orderId, DecorationBelongPO.BELONGTYPE_SALESMAN_INT, DecorationBelongPO.STATUS_INVALID_INT);

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(orderId);

		if (decorationAdditionPO != null) {

			decorationAdditionPO.clearDesign();
			decorationAdditionPO.clearSales();

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
		}

		decorationPO.setPrecontractPrice(precontractPrice);
		decorationPO.setPrecontractTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPO.setStatus(DecorationPO.STATUS_PROSIGN_INT); // 预签

		decorationDao.update(decorationPO);

		decorationOperateDao.save(new DecorationOperatePO().prosign(orderId, operater)); // 创建装修单操作信息

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "presignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		// 生成消息提示数据
		messageQueuingDao.save(new MessageCueuingPO().init(orderId, "presignDecorationContract", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));

		Map<String, Object> result = new HashMap<String, Object>();

		result.put("success", true);
		result.put("operation", "prosign");
		result.put("orderId", orderId);
		result.put("pid", protationPO.getPid());
		result.put("name", protationPO.getName());
		result.put("precontractPrice", precontractPrice);

		return result;
	}

	private String buildCcidArgs(String orderId) {

		if (orderId == null) return "";

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);

		return customerChancePO != null ? ",\"ccid\":" + customerChancePO.getCcid() : "";
	}

}
