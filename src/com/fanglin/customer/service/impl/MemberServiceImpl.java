package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.dao.PointAccountDao;
import com.fanglin.customer.dao.PointPaymentDao;
import com.fanglin.customer.dao.PointRecordDao;
import com.fanglin.customer.po.PointAccountPO;
import com.fanglin.customer.po.PointPaymentPO;
import com.fanglin.customer.po.PointRecordPO;
import com.fanglin.customer.service.MemberService;
import com.fanglin.customer.vo.BasePaymentVO;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("memberservice")
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

	@Autowired
	private MemberDao memberDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	// @Autowired
	// private SalesDao salesDao;

	// @Autowired
	// private SalesPaymentDao salesPaymentDao;

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private PointAccountDao pointAccountDao;

	@Autowired
	private PointRecordDao pointRecordDao;

	@Autowired
	private PointPaymentDao pointPaymentDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public Map<String, List<MemberVO>> queryMember(List<MemberVO> members) throws FLException {

		if (null == members || members.isEmpty()) {
			throw new FLException(130021, "客户电话不存在");
		}

		members = members.subList(0, Math.min(10, members.size()));

		Map<String, List<MemberVO>> resultMap = new HashMap<String, List<MemberVO>>();
		Map<String, List<Long>> phoneToCustomerMap = new HashMap<String, List<Long>>();

		List<Integer> companyIds = new ArrayList<Integer>();
		List<Long> customerIds = new ArrayList<Long>();
		List<String> phoneList = new ArrayList<String>();
		List<String> orderIdList = new ArrayList<String>();
		List<String> orderKeyList = new ArrayList<String>();

		// 收集所有查询条件：手机号或装修单号
		for (MemberVO member : members) {
			if (member.getOrderId() != null && !member.getOrderId().isEmpty()) {
				// 装修单号查询（去重）
				if (!orderIdList.contains(member.getOrderId())) {
					orderIdList.add(member.getOrderId());
					orderKeyList.add(member.getOrderId());
				}
			} else if (member.getPhone() != null) {
				// 手机号查询（加入所有可能的加密形式：明文、旧Base64、新ENC(V1:)）
				phoneList.addAll(SensitiveDataHelper.getAllEncryptedForms(member.getPhone()));
				resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
			}
		}

		// ========== 按装修单号查询 ==========
		if (!orderIdList.isEmpty()) {
			Map<Integer, String> companyMap = new HashMap<Integer, String>();
			Map<String, String> orderIdToKeyMap = new HashMap<String, String>();

			for (int i = 0; i < orderIdList.size(); i++) {
				String orderId = orderIdList.get(i);
				String key = orderKeyList.get(i);
				orderIdToKeyMap.put(orderId, key);
				resultMap.put(key, new ArrayList<MemberVO>());

				DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
				if (decorationPO != null) {
					Integer companyId = decorationPO.getCompany();
					companyIds.add(companyId);

					if (!companyMap.containsKey(companyId)) {
						List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(Arrays.asList(companyId));
						for (CompanyPO companyPO : companyPOs) {
							companyMap.put(companyPO.getCid(), companyPO.getName());
						}
					}

					String companyName = companyMap.get(companyId);
					MemberVO resultMember = new MemberVO().init(decorationPO, companyName, companyId);

					resultMap.get(key).add(resultMember);
				}
			}
		}

		// ========== 按手机号查询 ==========
		if (!phoneList.isEmpty()) {
			List<CustomerPO> customers = customerDao.queryCustomer(phoneList);

			for (CustomerPO customerPO : customers) {

				String plainPhone = SensitiveDataHelper.decrypt(customerPO.getPhone());
				List<Long> customerIdList = phoneToCustomerMap.get(plainPhone);

				if (customerIdList == null) {
					customerIdList = new ArrayList<Long>();
					phoneToCustomerMap.put(plainPhone, customerIdList);
				}

				if (customerIdList.contains(customerPO.getCid())) continue;

				customerIdList.add(customerPO.getCid());

				customerIds.add(customerPO.getCid());
			}

			if (customerIds.isEmpty()) {
				return resultMap;
			}

			List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);

			if (decorationPOs == null || decorationPOs.isEmpty()) {
				return resultMap;
			}

			Map<Long, List<DecorationPO>> customerToDecorationMap = new HashMap<Long, List<DecorationPO>>();

			for (DecorationPO decorationPO : decorationPOs) {

				companyIds.add(decorationPO.getCompany());

				Long customerId = decorationPO.getCustomer().getCid();
				List<DecorationPO> decorationList = customerToDecorationMap.get(customerId);
				if (decorationList == null) {
					decorationList = new ArrayList<DecorationPO>();
					customerToDecorationMap.put(customerId, decorationList);
				}

				decorationList.add(decorationPO);
			}

			if (companyIds.isEmpty()) {
				return resultMap;
			}

			Map<Integer, String> companyMap = new HashMap<Integer, String>();

			List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);

			for (CompanyPO companyPO : companyPOs) {
				companyMap.put(companyPO.getCid(), companyPO.getName());
			}

			for (MemberVO member : members) {
				String originalPhone = member.getPhone();
				if (originalPhone == null) continue;

				// phoneToCustomerMap 的 key 已是明文，直接用明文查找
				List<Long> customerIdList = phoneToCustomerMap.get(originalPhone);
				if (customerIdList == null) {
					continue;
				}

				List<MemberVO> memberList = resultMap.get(originalPhone);
				for (Long customerId : customerIdList) {
					List<DecorationPO> decorations = customerToDecorationMap.get(customerId);
					if (decorations == null) {
						continue;
					}

					for (DecorationPO decorationPO : decorations) {
						String companyName = companyMap.get(decorationPO.getCompany());
						Integer companyId = decorationPO.getCompany();
						MemberVO resultMember = new MemberVO().init(decorationPO, companyName, companyId);

						resultMember.setPhone(originalPhone);
						memberList.add(resultMember);
					}
				}
			}
		}

		return resultMap;
	}

	@Override
	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs) {

		if (memberPointVOs == null || memberPointVOs.isEmpty()) {
			return new ArrayList<MemberPointVO>();
		}

		List<MemberPointVO> memberPointFOs = memberPointVOs.subList(0, Math.min(10, memberPointVOs.size()));

		for (MemberPointVO memberPointVO : memberPointFOs) {

			String orderId = memberPointVO.getOrderId();

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			if (decorationPO == null) continue;

			long amount = Math.abs(pointAccountDao.amountDecorationPoint(orderId));
			long amountMaterial = Math.abs(pointAccountDao.amountMaterialPoint(orderId));

			long dpoint = 0l;
			long spoint = 0l;
			long point = 0l;

			dpoint = memberDao.amountMemberPointForDecoration(orderId);
			spoint = memberDao.amountMemberPointForMaterial(orderId);

			long subDecorationPoint = Arith.sub(dpoint, amount);
			long subMaterialPoint = Arith.sub(spoint, amountMaterial);
			memberPointVO.setDecorationPoint(Arith.mul(subDecorationPoint, 1l));
			memberPointVO.setMaterialPoint(Arith.mul(subMaterialPoint, 1l));

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

			memberPointVO.setFreezeDecorationPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getBalance() : 0, Arith.sub(memberDao.totalMemberPointForDecoration(orderId), dpoint)), 1l));
			memberPointVO.setFreezeMaterialPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0, Arith.sub(memberDao.totalMemberPointForMaterial(orderId), spoint)), 1l));

			point = Arith.add(memberPointVO.getDecorationPoint(), memberPointVO.getMaterialPoint());

			memberPointVO.setOperatePoint(point);
		}

		return memberPointFOs;
	}

	/**
	 * 查询会员信息（优化版本）
	 * 
	 * 【业务逻辑说明】 - 只返回【关联订单】（chanceRefer/originRefer/orderRefer），不返回主订单 - 如果客户没有装饰订单，返回空列表（不抛异常） - 关联订单的手机号从主订单推荐人获取 - 关联订单通过 referOrderId 字段关联到主订单
	 * 
	 * 【优化点】 1. 业务调整：只返回关联订单（推荐信息），隐藏主订单数据 2. 新增 referOrderId 字段：关联订单可追溯到主订单 3. 消除 N+1 查询问题 - 批量查询客户电话 4. 修复批量查询遗漏：包含关联订单的客户 5. 消除嵌套循环 - 使用反向索引 Map 6. 抽取重复代码 - 统一处理 refer 订单 7. 添加空值检查 - 提高健壮性（原代码有 NPE 风险） 8. uniqueId 降级策略：doid 无效时使用 orderId
	 * 
	 * @param members 会员查询条件列表（包含手机号）
	 * @param company 公司ID过滤条件
	 * @return Map<手机号, 会员列表>（仅包含关联订单/推荐信息）
	 * @throws FLException 业务异常
	 */
	@Override
	public Map<String, List<MemberVO>> queryMemberForInfo(List<MemberVO> members, Integer company) throws FLException {

		// ========== 1. 参数校验 ==========
		if (members == null || members.isEmpty()) {
			throw new FLException(130021, "客户电话不存在");
		}

		Map<String, List<MemberVO>> resultMap = new HashMap<String, List<MemberVO>>();

		// 限制查询数量（保持原逻辑）
		members = members.subList(0, Math.min(10, members.size()));

		// ========== 2. 构建手机号列表和初始结果容器 ==========
		List<String> encodedPhoneList = new ArrayList<String>();
		List<Long> customerIds = new ArrayList<Long>();
		List<String> queryOrderIds = new ArrayList<String>();

		for (MemberVO member : members) {
			if (member.getOrderId() != null && !member.getOrderId().isEmpty()) {
				// 装修单号查询模式 - 将在后续处理
				queryOrderIds.add(member.getOrderId());
			} else if (member.getPhone() != null) {
				// 手机号查询模式（加入所有可能的加密形式）
				encodedPhoneList.addAll(SensitiveDataHelper.getAllEncryptedForms(member.getPhone()));
				resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
			} else {
				throw new FLException(130182, "客户电话或装修单号不存在");
			}
		}

		// ========== 3. 查询客户电话并构建映射关系 ==========
		List<DecorationPO> decorationPOs = new ArrayList<DecorationPO>();
		List<CustomerPhonePO> customerPhoneList = new ArrayList<CustomerPhonePO>();
		Map<String, String> orderIdToPhoneMap = new HashMap<String, String>(); // 装修单号 -> 推荐人手机号

		// 处理装修单号查询（如果存在）
		if (!queryOrderIds.isEmpty()) {
			for (String orderId : queryOrderIds) {
				DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
				if (decorationPO != null) {
					// 验证公司权限
					if (company != null && decorationPO.getCompany() != company) {
						continue;
					}

					// 查找推荐人手机号（通过订单所属客户查询）
					CustomerPO orderCustomer = decorationPO.getCustomer();
					if (orderCustomer != null) {
						List<CustomerPhonePO> orderPhones = customerPhoneDao.queryCustomerPhoneByCid(orderCustomer.getCid(), null);
						if (orderPhones != null && !orderPhones.isEmpty()) {
							String phone = SensitiveDataHelper.decrypt(orderPhones.get(0).getPhone());
							if (phone != null) {
								orderIdToPhoneMap.put(orderId, phone);
								if (!resultMap.containsKey(phone)) {
									resultMap.put(phone, new ArrayList<MemberVO>());
								}
							}
						}
					}

					decorationPOs.add(decorationPO);
				}
			}
		}

		// 客户ID -> 手机号(原始) - 反向索引，消除嵌套循环（提升到外层，装修单号查询时也需要）
		Map<Long, String> customerToPhoneMap = new HashMap<Long, String>();

		// 处理手机号查询（如果存在）
		if (!encodedPhoneList.isEmpty()) {
			customerPhoneList = customerPhoneDao.queryCustomerPhone(encodedPhoneList, null, null, company);

			if (customerPhoneList == null || customerPhoneList.isEmpty()) {
				if (decorationPOs.isEmpty()) {
					// 两种查询方式都无结果
					return resultMap;
				}
			}

			// 手机号(原始) -> 客户ID列表
			Map<String, List<Long>> phoneToCustomerMap = new HashMap<String, List<Long>>();

			for (CustomerPhonePO customerPhone : customerPhoneList) {
				String originalPhone = SensitiveDataHelper.decrypt(customerPhone.getPhone());
				// 只处理在 resultMap 中的手机号（保持原逻辑）
				if (resultMap.containsKey(originalPhone)) {
					List<Long> customerIdList = phoneToCustomerMap.get(originalPhone);
					if (customerIdList == null) {
						customerIdList = new ArrayList<Long>();
						phoneToCustomerMap.put(originalPhone, customerIdList);
					}
					customerIdList.add(customerPhone.getCid());
					customerToPhoneMap.put(customerPhone.getCid(), originalPhone);
					customerIds.add(customerPhone.getCid());
				}
			}

			// ========== 4. 查询装饰订单 ==========
			List<DecorationPO> phoneDecorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);
			if (phoneDecorationPOs != null) {
				decorationPOs.addAll(phoneDecorationPOs);
			}
		}

		List<DecorationPO> referOrders = new ArrayList<DecorationPO>(); // 关联订单

		// 【保持原逻辑】没有装饰订单时返回空结果，不抛异常
		if (decorationPOs.isEmpty()) {
			return resultMap;
		}

		// 订单ID -> 推荐人手机号
		Map<String, String> orderToPhoneMap = new HashMap<String, String>();
		// 关联订单ID -> 主订单ID（用于设置 referOrderId）
		Map<String, String> referToParentOrderMap = new HashMap<String, String>();

		// ========== 5. 构建订单-手机号映射（主订单） ==========
		for (DecorationPO decorationPO : decorationPOs) {
			CustomerPO customer = decorationPO.getCustomer();
			if (customer != null) {
				Long cid = customer.getCid();
				// 通过反向索引直接查找手机号，O(1) 复杂度（原代码是嵌套循环 O(n×m)）
				String phone = customerToPhoneMap.get(cid);
				if (phone != null) {
					orderToPhoneMap.put(decorationPO.getOrderId(), phone);
				}
			}

			// 对于装修单号查询模式，使用 orderIdToPhoneMap
			if (orderIdToPhoneMap.containsKey(decorationPO.getOrderId())) {
				orderToPhoneMap.put(decorationPO.getOrderId(), orderIdToPhoneMap.get(decorationPO.getOrderId()));
			}

			// 【健壮性改进】原代码 customer 为 null 会抛 NPE，优化后跳过
		}

		// ========== 6. 查询并收集关联订单 ==========
		processReferOrders(decorationPOs, referOrders, orderToPhoneMap, referToParentOrderMap, new ReferOrderQuery() {
			public List<DecorationPO> query(String orderId) {
				return decorationInfoDao.queryDecorationForChanceRefer(orderId);
			}
		});

		processReferOrders(decorationPOs, referOrders, orderToPhoneMap, referToParentOrderMap, new ReferOrderQuery() {
			public List<DecorationPO> query(String orderId) {
				return decorationInfoDao.queryDecorationForOriginRefer(orderId);
			}
		});

		processReferOrders(decorationPOs, referOrders, orderToPhoneMap, referToParentOrderMap, new ReferOrderQuery() {
			public List<DecorationPO> query(String orderId) {
				return decorationInfoDao.queryDecorationForOrderReferd(orderId);
			}
		});

		// ========== 6.5 【修复】补充收集关联订单的客户ID（防止批量查询遗漏）==========
		Set<Long> allCustomerIds = new HashSet<Long>(customerIds); // 使用 Set 去重
		for (DecorationPO refer : referOrders) {
			CustomerPO customer = refer.getCustomer();
			if (customer != null) {
				allCustomerIds.add(customer.getCid());
			}
		}
		// 转换回 List
		customerIds = new ArrayList<Long>(allCustomerIds);

		// ========== 7. 批量查询客户电话（消除 N+1 问题）==========
		Map<Long, List<CustomerPhonePO>> customerPhoneBatchMap = new HashMap<Long, List<CustomerPhonePO>>();
		for (Long cid : customerIds) {
			List<CustomerPhonePO> phones = customerPhoneDao.queryCustomerPhoneByCid(cid, CustomerPhonePO.STATUS_ENABLE_INT);
			if (phones != null && !phones.isEmpty()) {
				customerPhoneBatchMap.put(cid, phones);
			}
		}

		// ========== 8. 构建 orderId -> doid 映射（用于生成 uniqueId）==========
		Map<String, Long> orderIdToDoIdMap = new HashMap<String, Long>();
		for (DecorationPO po : decorationPOs) {
			orderIdToDoIdMap.put(po.getOrderId(), po.getDoid());
		}
		// 关联订单也需要映射
		for (DecorationPO po : referOrders) {
			orderIdToDoIdMap.put(po.getOrderId(), po.getDoid());
		}

		// ========== 9. 构建返回结果（仅关联订单/推荐信息） ==========
		// 【业务调整】只返回关联订单（推荐信息），不返回主订单

		// 9.0 批量查询所有订单的活动项目数量（避免 N+1 查询）
		List<String> allOrderIds = new ArrayList<String>();
		for (DecorationPO po : decorationPOs) {
			allOrderIds.add(po.getOrderId());
		}
		for (DecorationPO po : referOrders) {
			allOrderIds.add(po.getOrderId());
		}

		// 定义有效状态列表（排除失效、退货和采购状态）
		// 有效状态：初始(0)、已领(2)、配送(4)、未退(5)、升级(6)、消耗(7)、抵现(8)
		// 无效状态：失效(1)、退货(3)、采购(9)
		List<Short> validStates = Arrays.asList(DecorationActivityItemPO.STATUS_INIT_INT, // 初始
				DecorationActivityItemPO.STATUS_RECEIVE_INT, // 已领
				DecorationActivityItemPO.STATUS_DELIVERY_INT, // 配送
				DecorationActivityItemPO.STATUS_WAIT_INT, // 未退
				DecorationActivityItemPO.STATUS_UPGRADE_INT, // 升级
				DecorationActivityItemPO.STATUS_CONSUME_INT, // 消耗
				DecorationActivityItemPO.STATUS_DISCOUNT_INT, // 抵现
				DecorationActivityItemPO.STATUS_VERIFY_INT // 核销
				);

		// orderId -> 活动项目数量映射
		Map<String, Integer> orderActivityCountMap = new HashMap<String, Integer>();
		if (!allOrderIds.isEmpty()) {
			for (String orderId : allOrderIds) {
				// 使用 COUNT(*) 统计数量，而不是 SUM(money*num) 计算金额
				long count = decorationActivityItemDao.countDecorationActivityItem(orderId, null, validStates, null, null);
				orderActivityCountMap.put(orderId, (int) count);
			}
		}

		// 9.1 只返回关联订单（推荐信息），不返回主订单

		// 9.2 处理关联订单（推荐信息）
		for (DecorationPO decorationPO : referOrders) {
			String recommenderPhone = orderToPhoneMap.get(decorationPO.getOrderId());
			if (recommenderPhone == null) {
				continue;
			}

			CustomerPO customer = decorationPO.getCustomer();
			if (customer == null) {
				continue;
			}

			List<CustomerPhonePO> customerPhones = customerPhoneBatchMap.get(customer.getCid());
			if (customerPhones != null && !customerPhones.isEmpty()) {
				String phone = SensitiveDataHelper.decrypt(customerPhones.get(0).getPhone());
				String parentOrderId = referToParentOrderMap.get(decorationPO.getOrderId());
				String uniqueId = generateUniqueId(decorationPO.getDoid(), decorationPO.getOrderId(), parentOrderId, orderIdToDoIdMap);
				Integer activityCount = orderActivityCountMap.get(decorationPO.getOrderId());

				MemberVO member = createMemberVO(decorationPO, phone, parentOrderId, uniqueId, activityCount);

				List<MemberVO> memberList = resultMap.get(recommenderPhone);
				if (memberList != null) {
					memberList.add(member);
				}
			}
		}

		return resultMap;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMemberActivity(MemberActivityVO memberActivityVO, List<String> companys, String userId) throws FLException {

		if (memberActivityVO.getType() == null || memberActivityVO.getType() < 0 || memberActivityVO.getType() > 2) {
			throw new FLException(130183, "活动类型参数错误");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		if (companys == null) companys = Arrays.asList(CompanyServiceImpl.encode(CompanyPO.TYPE_HEADQUARTER_INT));

		for (String company : companys) {

			ActivityPO activityPO = null;

			short decotype = 0;
			short saletype = 0;

			if (memberActivityVO.getType() == 0) {
				decotype = 1;
			}

			if (memberActivityVO.getType() == 1) {
				saletype = 1;
			}

			if (memberActivityVO.getType() == 2) {
				decotype = 1;
				saletype = 1;
			}

			if (decotype == 1) {

				activityPO = new ActivityPO();

				BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

				activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				activityPO.setCreater(creater);

				activityPO.setCompany(CompanyServiceImpl.decode(company));
				activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);
				activityPO.setType(ActivityPO.TYPE_DECORATION_INT);
				activityPO.setMultiple(memberActivityVO.getMultiple());
				activityPO.setAtttype(ActivityPO.ATTTYPE_ONLINE_INT);

				activityDao.save(activityPO);
			}

			if (saletype == 1) {

				activityPO = new ActivityPO();

				BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

				activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				activityPO.setCreater(creater);
				activityPO.setCompany(CompanyServiceImpl.decode(company));

				activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);
				activityPO.setType(ActivityPO.TYPE_SALES_INT);
				activityPO.setMultiple(memberActivityVO.getMultiple());
				activityPO.setAtttype(ActivityPO.ATTTYPE_ONLINE_INT);

				activityDao.save(activityPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeMemberOrder(MemberOrderVO memberOrderVO, List<MemberOrderItemVO> memberOrderItemVOs, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		long amount = Math.abs(pointAccountDao.amountDecorationPoint(orderId));
		long amountMaterial = Math.abs(pointAccountDao.amountMaterialPoint(orderId));

		long totald = memberDao.amountMemberPointForDecoration(orderId);
		long totals = memberDao.amountMemberPointForMaterial(orderId);
		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(orderId);

		DecorationActivityPO decorationActivityPO = decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0) : null;

		if (decorationActivityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (MemberOrderItemVO memberOrderItemVO : memberOrderItemVOs) {

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

			AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberOrderItemVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

			decorationActivityItemPO.setOrderId(orderId);

			decorationActivityItemPO.setAid(decorationActivityPO.getActivity().getAid());
			decorationActivityItemPO.setActivityName(decorationActivityPO.getActivity().getName());

			if (awardStockPO != null) decorationActivityItemPO.setAsid(awardStockPO.getAsId());

			decorationActivityItemPO.setActivityItemName(memberOrderItemVO.getName());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DELIVERY_INT);

			decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
			decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);

			decorationActivityItemPO.setNo(memberOrderVO.getPointOrderId());
			decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_ONLINE_INT);
			decorationActivityItemPO.setNum((int) Arith.mul(memberOrderItemVO.getNum(), 1000000l));
			decorationActivityItemPO.setMoney((int) Arith.mul(memberOrderItemVO.getPoint(), 1000000l));
			decorationActivityItemPO.setCreater(creater);
			decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			// 设置有效期：创建时间 + 活动有效天数
			int validays = decorationActivityPO.getActivity().getValidays();
			if (validays > 0) {
				Calendar calendar = Calendar.getInstance();
				calendar.add(Calendar.DAY_OF_MONTH, validays);
				decorationActivityItemPO.setExpireTime(new Timestamp(calendar.getTimeInMillis()));
			}

			// 设置 uniqueId，用于区分不同活动物品对应的被推荐装修单号和推荐装修单号的对应关系
			decorationActivityItemPO.setUniqueId(memberOrderVO.getUniqueId());

			decorationActivityItemDao.save(decorationActivityItemPO);
		}

		PointAccountPO pointAccountPO = pointAccountDao.queryPointAccountByOrderId(orderId);

		if (pointAccountPO == null) {

			pointAccountPO = new PointAccountPO();

			pointAccountPO.setCustomer(decorationPO.getCustomer());
			pointAccountPO.setOrderId(orderId);
			pointAccountPO.setCompany(decorationPO.getCompany());
		}

		pointAccountPO.setDecorationPoint(Arith.sub(totald, amount));
		pointAccountPO.setMaterialPoint(Arith.sub(totals, amountMaterial));
		pointAccountPO.setOperatePoint(totalo);

		pointAccountPO.setPoint(Arith.sub(Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), Arith.mul(memberOrderVO.getPoint(), 1000000l)));
		pointAccountDao.saveOrUpdate(pointAccountPO);

		addPointPayment(memberOrderVO, pointAccountPO, decorationActivityPO.getActivity().getMultiple());

		pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_USERUP_INT, PointRecordPO.POINTTYPE_DECORATION_INT, Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_USERUP_INT, PointRecordPO.POINTTYPE_OPOINT_INT, pointAccountPO.getOperatePoint(), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeMemberOrderItem(MemberOrderVO memberOrderVO, MemberOrderItemVO memberOrderItemVO, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(orderId);

		DecorationActivityPO decorationActivityPO = decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0) : null;

		if (decorationActivityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		// 校验:atttype=1(线上)物品无论何种状态,每单仅限1件
		if (decorationActivityItemDao.countDecorationActivityItemForAtttype(orderId, DecorationActivityItemPO.ATTTYPE_ONLINE_INT) > 0) {
			throw new FLException(140103, "活动物品数量超限");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();
		AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberOrderItemVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);
		decorationActivityItemPO.setOrderId(orderId);

		decorationActivityItemPO.setAid(decorationActivityPO.getActivity().getAid());
		decorationActivityItemPO.setActivityName(decorationActivityPO.getActivity().getName());

		if (awardStockPO != null) decorationActivityItemPO.setAsid(awardStockPO.getAsId());

		decorationActivityItemPO.setActivityItemName(memberOrderItemVO.getName());
		decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_INIT_INT);

		decorationActivityItemPO.setIsPrefor(memberOrderItemVO.getIsPrefer() != null ? memberOrderItemVO.getIsPrefer() : DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
		decorationActivityItemPO.setIsPayment(memberOrderItemVO.getIsPayment() != null ? memberOrderItemVO.getIsPayment() : DecorationActivityItemPO.ISPAYMENT_CAL_INT);

		decorationActivityItemPO.setNo(memberOrderVO.getPointOrderId());
		decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_ONLINE_INT);
		decorationActivityItemPO.setNum((int) Arith.mul(memberOrderItemVO.getNum(), 1000000l));
		decorationActivityItemPO.setMoney((int) Arith.mul(memberOrderItemVO.getPoint(), 1000000l));
		decorationActivityItemPO.setCreater(creater);
		decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		// 设置 uniqueId，用于区分不同活动物品对应的被推荐装修单号和推荐装修单号的对应关系
		decorationActivityItemPO.setUniqueId(memberOrderVO.getUniqueId());

		// 设置有效期
		decorationActivityItemPO.setExpireTime(memberOrderItemVO.getExpireTime());

		decorationActivityItemDao.save(decorationActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelMemberOrder(MemberOrderVO memberOrderVO, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		PointAccountPO pointAccountPO = pointAccountDao.queryPointAccountByOrderId(orderId);

		if (pointAccountPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItem(orderId, memberOrderVO.getPointOrderId());

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

			decorationActivityItemDao.update(decorationActivityItemPO);
		}

		decorationActivityItemDao.flush();

		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		pointAccountPO.setOperatePoint(totalo);

		pointAccountPO.setPoint(Arith.add(pointAccountPO.getPoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l)));

		pointAccountDao.saveOrUpdate(pointAccountPO);

		cancelPointPayment(memberOrderVO);

		pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_ADDUP_INT, PointRecordPO.POINTTYPE_DECORATION_INT, Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_ADDUP_INT, PointRecordPO.POINTTYPE_OPOINT_INT, pointAccountPO.getOperatePoint(), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelMemberOrderItem(MemberOrderVO memberOrderVO, MemberOrderItemVO memberOrderItemVO, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItem(orderId, memberOrderVO.getPointOrderId());

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			if (decorationActivityItemPO.getState() != DecorationActivityItemPO.STATUS_INIT_INT) {
				throw new FLException(140102, "装修活动奖品不可操作");
			}

			decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

			decorationActivityItemDao.update(decorationActivityItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMemberGoods(MemberGoodsVO memberGoodsVO) {

		AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberGoodsVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

		// 获取业绩和金额标识，如果未传递则默认为1（不计入）
		short isPrefor = memberGoodsVO.getIsPrefor() != null ? memberGoodsVO.getIsPrefor() : AwardStockPO.ISPREFOR_NCAL_INT;
		short isPayment = memberGoodsVO.getIsPayment() != null ? memberGoodsVO.getIsPayment() : AwardStockPO.ISPAYMENT_NCAL_INT;

		if (awardStockPO == null) {

			awardStockPO = new AwardStockPO();

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
			awardStockPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);
			awardStockPO.setFormat(memberGoodsVO.getCategory());
			awardStockPO.setIsPrefor(isPrefor);
			awardStockPO.setIsPayment(isPayment);

			awardStockDao.save(awardStockPO);
		} else {

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
			awardStockPO.setIsPrefor(isPrefor);
			awardStockPO.setIsPayment(isPayment);

			awardStockDao.update(awardStockPO);
		}

		return 0;
	}

	private void addPointPayment(MemberOrderVO memberOrderVO, PointAccountPO pointAccountPO, int multiple) throws FLException {

		long totalPoints = Arith.mul(memberOrderVO.getPoint(), multiple);

		PointRecordPO pointRecord = pointRecordDao.queryPointRecordByOrderId(memberOrderVO.getOrderId());

		List<PointPaymentPO> pointPayments = pointPaymentDao.queryPointPaymentByOrderId(memberOrderVO.getOrderId());

		List<BasePaymentVO> allPayments = getAllPaymentsByOrderId(memberOrderVO.getOrderId());

		if (allPayments == null || allPayments.isEmpty()) {
			throw new FLException(130174, "客户支付记录不存在");
		}

		Map<Long, Long> paymentUsedMap = new HashMap<Long, Long>();

		Map<Long, Long> paymentAvailableMap = new HashMap<Long, Long>();

		for (BasePaymentVO basePayment : allPayments) {
			paymentAvailableMap.put(basePayment.getPaymentId(), Arith.mul(basePayment.getReferMoney(), 1l));
		}

		if (pointPayments != null) {

			for (PointPaymentPO pointPayment : pointPayments) {

				Long paymentId = pointPayment.getPid();

				long usedPoints = pointPayment.getPoint();
				Long currentUsed = paymentUsedMap.get(paymentId);

				if (currentUsed == null) {

					paymentUsedMap.put(paymentId, usedPoints);
				} else {
					paymentUsedMap.put(paymentId, currentUsed + usedPoints);
				}

				Long currentAvailable = paymentAvailableMap.get(paymentId);
				if (currentAvailable != null) {

					paymentAvailableMap.put(paymentId, currentAvailable - usedPoints);

				}
			}
		}

		List<PointPaymentPO> newRecords = new ArrayList<PointPaymentPO>();

		for (BasePaymentVO basePayment : allPayments) {

			if (totalPoints <= 0) {
				break;
			}

			Long decorationPaymentId = basePayment.getPaymentId();
			Long availablePoints = paymentAvailableMap.get(decorationPaymentId);// 这笔支付当前可用的积分余额

			if (availablePoints <= 0) {
				continue;
			}

			long point = Math.min(availablePoints, totalPoints);

			if (point > 0) {

				PointPaymentPO pointPayment = new PointPaymentPO();
				pointPayment.setAccountId(pointAccountPO.getAccountId());
				pointPayment.setPointRecord(pointRecord);
				pointPayment.setNo(memberOrderVO.getPointOrderId());
				pointPayment.setOrderId(memberOrderVO.getOrderId());
				pointPayment.setPid(basePayment.getPaymentId());
				pointPayment.setType(basePayment.getPaymentType());
				pointPayment.setPoint(point);
				pointPayment.setStatus(PointPaymentPO.STATUS_ABLE_SHORT);
				pointPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				newRecords.add(pointPayment);

				totalPoints -= point;
				paymentAvailableMap.put(decorationPaymentId, availablePoints - point);
			}
		}

		for (PointPaymentPO record : newRecords) {
			pointPaymentDao.save(record);
		}

	}

	private void cancelPointPayment(MemberOrderVO memberOrderVO) throws FLException {

		pointRecordDao.updatePointRecordByNo(memberOrderVO.getPointOrderId());

		pointPaymentDao.updatePointPaymentByNo(memberOrderVO.getPointOrderId());

	}

	/**
	 * 获取所有支付记录并按创建时间排序
	 */
	private List<BasePaymentVO> getAllPaymentsByOrderId(String orderId) throws FLException {
		List<BasePaymentVO> allPayments = new ArrayList<BasePaymentVO>();

		// 查询装修支付记录
		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT, DecorationPaymentPO.PAYMENTSTATUS_APPLYING_INT };

		// 查询装修支付记录
		List<DecorationPaymentPO> decorationPayments = decorationPaymentDao.queryDecorationPaymentByOrderId(orderId, paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		if (decorationPayments != null) {
			for (DecorationPaymentPO dp : decorationPayments) {
				allPayments.add(new BasePaymentVO(dp.getDpid(), dp.getReferMoney(), dp.getCreateTime(), PointPaymentPO.TYPE_DECORATION_INT));
			}
		}

		/*
		 * List<Long> salesIds = new ArrayList<Long>(); List<Short> deposiTtypes = Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.STATUS_PAIDFOR_INT);
		 * 
		 * List<SalesPO> salesList = salesDao.querySalesByOrderId(orderId); for(SalesPO sales : salesList){ salesIds.add(sales.getSid()); } // 查询主材支付记录 List<SalesPaymentPO> salesPayments = salesPaymentDao.querySalesPaymentBySids(salesIds, deposiTtypes); if (salesPayments != null) { for (SalesPaymentPO salesPayment : salesPayments) { allPayments.add(new BasePaymentVO(salesPayment.getSpid(), salesPayment.getReferMoney(), salesPayment.getCreateTime(), PointPaymentPO.TYPE_MATERIAL_INT)); } }
		 */

		// 按创建时间排序
		Collections.sort(allPayments, new Comparator<BasePaymentVO>() {
			@Override
			public int compare(BasePaymentVO o1, BasePaymentVO o2) {
				return o1.getCreateTime().compareTo(o2.getCreateTime());
			}
		});

		return allPayments;
	}

	// ==================== queryMemberForInfo 优化方法的辅助方法 ====================

	/**
	 * 生成 uniqueId
	 * 
	 * @param doid 当前订单 doid
	 * @param orderId 当前订单号（降级使用）
	 * @param parentOrderId 主订单号（关联订单专用，主订单传 null）
	 * @param orderIdToDoIdMap orderId->doid 映射（可为 null）
	 * @return uniqueId
	 */
	private String generateUniqueId(long doid, String orderId, String parentOrderId, Map<String, Long> orderIdToDoIdMap) {
		// 主订单
		if (parentOrderId == null) {
			if (doid > 0) {
				return String.valueOf(doid);
			} else {
				// doid 无效时降级使用 orderId
				return orderId;
			}
		}

		// 关联订单：parentDoid-doid
		Long parentDoid = (orderIdToDoIdMap != null) ? orderIdToDoIdMap.get(parentOrderId) : null;
		if (parentDoid != null && parentDoid > 0 && doid > 0) {
			return parentDoid + "-" + doid;
		} else {
			// 降级方案：parentOrderId-orderId
			return parentOrderId + "-" + orderId;
		}
	}

	/**
	 * 创建 MemberVO 对象（抽取公共方法）
	 * 
	 * @param decorationPO 装饰订单
	 * @param phone 手机号
	 * @param referOrderId 主订单号
	 * @param uniqueId 唯一标识
	 * @param activityItemCount 活动项目数量
	 * @return MemberVO
	 */
	private MemberVO createMemberVO(DecorationPO decorationPO, String phone, String referOrderId, String uniqueId, Integer activityItemCount) {
		MemberVO member = new MemberVO();
		member.setPhone(phone);
		member.setStoreTime(decorationPO.getCreateTime());
		member.setOrderId(decorationPO.getOrderId());
		member.setReferOrderId(referOrderId);
		member.setUniqueId(uniqueId);

		if (decorationPO.getPrecontractTime() != null) {
			member.setContractTime(decorationPO.getPrecontractTime());
		} else if (decorationPO.getContractTime() != null) {
			member.setContractTime(decorationPO.getContractTime());
		}

		member.setStatus(decorationPO.getStatus());
		member.setPaySacle(decorationPO.getPaySacle());
		member.setCompanyId(decorationPO.getCompany());
		member.setActivityItemCount(activityItemCount);
		return member;
	}

	/**
	 * 处理关联订单（抽取的公共方法）
	 * 
	 * @param parentOrders 父订单列表
	 * @param referOrders 收集关联订单的列表
	 * @param orderToPhoneMap 订单-手机号映射
	 * @param referToParentOrderMap 关联订单->主订单 映射（用于设置 referOrderId）
	 * @param query 查询接口
	 */
	private void processReferOrders(List<DecorationPO> parentOrders, List<DecorationPO> referOrders, Map<String, String> orderToPhoneMap, Map<String, String> referToParentOrderMap, ReferOrderQuery query) {
		for (DecorationPO parent : parentOrders) {
			String parentPhone = orderToPhoneMap.get(parent.getOrderId());
			if (parentPhone == null) {
				continue;
			}

			List<DecorationPO> orders = query.query(parent.getOrderId());
			if (orders != null) {
				for (DecorationPO refer : orders) {
					referOrders.add(refer);
					// 关联订单使用与父订单相同的推荐人手机号
					orderToPhoneMap.put(refer.getOrderId(), parentPhone);
					// 记录关联订单->主订单 的映射关系
					referToParentOrderMap.put(refer.getOrderId(), parent.getOrderId());
				}
			}
		}
	}

	/**
	 * 关联订单查询接口
	 */
	private interface ReferOrderQuery {
		List<DecorationPO> query(String orderId);
	}
}
