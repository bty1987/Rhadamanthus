package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.dao.CppointPaymentDao;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.customer.po.CppointPaymentPO;
import com.fanglin.customer.po.CppointRecordPO;
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
import com.fanglin.utils.FormatUtil;

import edu.emory.mathcs.backport.java.util.Collections;

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
	private CppointDao cppointDao;

	@Autowired
	private CppointRecordDao cppointRecordDao;

	@Autowired
	private CppointPaymentDao cppointPaymentDao;

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

		for (MemberVO member : members) {
			if (member.getPhone() == null) continue;

			phoneList.add(FormatUtil.encodePhone(member.getPhone()));
			resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
		}

		List<CustomerPO> customers = customerDao.queryCustomer(phoneList);

		for (CustomerPO customerPO : customers) {

			List<Long> customerIdList = phoneToCustomerMap.get(customerPO.getPhone());

			if (customerIdList == null) {
				customerIdList = new ArrayList<Long>();
				phoneToCustomerMap.put(customerPO.getPhone(), customerIdList);
			}

			if (customerIdList.contains(customerPO.getCid())) continue;

			customerIdList.add(customerPO.getCid());
		}

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhone(phoneList, CustomerPhonePO.STATUS_ENABLE_INT, null, null);

		for (CustomerPhonePO customerPhone : customerPhones) {

			List<Long> customerIdList = phoneToCustomerMap.get(customerPhone.getPhone());

			if (customerIdList == null) {
				customerIdList = new ArrayList<Long>();
				phoneToCustomerMap.put(customerPhone.getPhone(), customerIdList);
			}

			if (customerIdList.contains(customerPhone.getCid())) continue;

			customerIdList.add(customerPhone.getCid());
		}

		for (CustomerPhonePO customerPhone : customerPhones) {
			customerIds.add(customerPhone.getCid());
		}

		if (customerIds == null || customerIds.size() == 0) {
			throw new FLException(130006, "客户电话不存在");
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);

		if (decorationPOs == null || decorationPOs.size() == 0) {
			throw new FLException(130006, "客户装修信息不存在");
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

		if (companyIds == null || companyIds.size() == 0) {
			throw new FLException(130006, "客户公司不存在");
		}

		Map<Integer, String> companyMap = new HashMap<Integer, String>();

		List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);

		for (CompanyPO companyPO : companyPOs) {
			companyMap.put(companyPO.getCid(), companyPO.getName());
		}

		for (MemberVO member : members) {
			String originalPhone = member.getPhone();
			String encodedPhone = FormatUtil.encodePhone(originalPhone);

			List<Long> customerIdList = phoneToCustomerMap.get(encodedPhone);
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
					MemberVO resultMember = new MemberVO().init(decorationPO, companyName);

					resultMember.setPhone(originalPhone);
					memberList.add(resultMember);
				}
			}
		}

		return resultMap;
	}

	@Override
	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs) {

		List<MemberPointVO> memberPointFOs = memberPointVOs.subList(0, Math.min(10, memberPointVOs.size()));

		for (MemberPointVO memberPointVO : memberPointFOs) {

			String orderId = memberPointVO.getOrderId();

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			if (decorationPO == null) continue;

			long amount = Math.abs(cppointDao.amountCppoint(orderId));

			long dpoint = 0l;
			long spoint = 0l;
			long point = 0l;

			dpoint = memberDao.amountMemberPointForDecoration(orderId);
			spoint = memberDao.amountMemberPointForMaterial(orderId);

			long subDecorationPoint = Arith.sub(dpoint, amount);
			long subMaterialPoint = Arith.sub(spoint, 0);
			memberPointVO.setDecorationPoint(Arith.mul(subDecorationPoint, 1l));
			memberPointVO.setMaterialPoint(Arith.mul(subMaterialPoint, 1l));

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

			memberPointVO.setFreezeDecorationPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getBalance() : 0, Arith.sub(memberDao.totalMemberPointForDecoration(orderId), dpoint)), 1l));
			memberPointVO.setFreezeMaterialPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0, Arith.sub(memberDao.totalMemberPointForMaterial(orderId), spoint)), 1l));

			point = Arith.add(memberPointVO.getDecorationPoint(), memberPointVO.getMaterialPoint());

			memberPointVO.setOperatePoint(point);
		}

		return memberPointVOs;
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

		for (MemberVO member : members) {
			if (member.getPhone() != null) {
				encodedPhoneList.add(FormatUtil.encodePhone(member.getPhone()));
				resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
			} else {
				throw new FLException(130021, "客户电话不存在");
			}
		}

		// ========== 3. 查询客户电话并构建映射关系 ==========
		List<CustomerPhonePO> customerPhoneList = customerPhoneDao.queryCustomerPhone(encodedPhoneList, null, null, company);

		if (customerPhoneList == null || customerPhoneList.isEmpty()) {
			throw new FLException(130021, "客户电话不存在");
		}

		// 手机号(原始) -> 客户ID列表
		Map<String, List<Long>> phoneToCustomerMap = new HashMap<String, List<Long>>();
		// 客户ID -> 手机号(原始) - 反向索引，消除嵌套循环
		Map<Long, String> customerToPhoneMap = new HashMap<Long, String>();

		for (CustomerPhonePO customerPhone : customerPhoneList) {
			String originalPhone = FormatUtil.decodePhone(customerPhone.getPhone());

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
		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);
		List<DecorationPO> referOrders = new ArrayList<DecorationPO>(); // 关联订单

		// 【保持原逻辑】没有装饰订单时返回空结果，不抛异常
		if (decorationPOs == null || decorationPOs.isEmpty()) {
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
		List<Short> validStates = Arrays.asList(
			DecorationActivityItemPO.STATUS_INIT_INT,           // 初始
			DecorationActivityItemPO.STATUS_RECEIVE_INT,        // 已领
			DecorationActivityItemPO.STATUS_DELIVERY_INT,       // 配送
			DecorationActivityItemPO.STATUS_WAIT_INT,           // 未退
			DecorationActivityItemPO.STATUS_UPGRADE_INT,        // 升级
			DecorationActivityItemPO.STATUS_CONSUME_INT,        // 消耗
			DecorationActivityItemPO.STATUS_DISCOUNT_INT        // 抵现
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

		// 9.1 【隐藏】处理主订单 - 根据业务需求，只返回推荐信息（关联订单）
		// for (DecorationPO decorationPO : decorationPOs) {
		// 	String recommenderPhone = orderToPhoneMap.get(decorationPO.getOrderId());
		// 	if (recommenderPhone == null) {
		// 		continue;
		// 	}
		//
		// 	CustomerPO customer = decorationPO.getCustomer();
		// 	if (customer == null) {
		// 		continue;
		// 	}
		//
		// 	List<CustomerPhonePO> customerPhones = customerPhoneBatchMap.get(customer.getCid());
		// 	if (customerPhones != null && !customerPhones.isEmpty()) {
		// 		String phone = FormatUtil.decodePhone(customerPhones.get(0).getPhone());
		// 		String referOrderId = null;
		// 		String uniqueId = generateUniqueId(decorationPO.getDoid(), decorationPO.getOrderId(), null);
		// 		Integer activityCount = orderActivityCountMap.get(decorationPO.getOrderId());
		//
		// 		MemberVO member = createMemberVO(decorationPO, phone, referOrderId, uniqueId, activityCount);
		//
		// 		List<MemberVO> memberList = resultMap.get(recommenderPhone);
		// 		if (memberList != null) {
		// 			memberList.add(member);
		// 		}
		// 	}
		// }

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
				String phone = FormatUtil.decodePhone(customerPhones.get(0).getPhone());
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

				activityPO.setDefaults(ActivityPO.TYPE_DECORATION_INT);
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

				activityPO.setDefaults(ActivityPO.TYPE_SALES_INT);
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
			throw new FLException(140013, "订单不存在");
		}

		long amount = Math.abs(cppointDao.amountCppoint(orderId));

		long totald = memberDao.amountMemberPointForDecoration(orderId);
		long totals = memberDao.amountMemberPointForMaterial(orderId);
		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		if (Arith.add(Arith.sub(totald, amount), Arith.sub(totals, 0)) < Arith.mul(memberOrderVO.getPoint(), 1000000l)) {
			throw new FLException(330049, "积分不足");
		}

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

			// 设置 uniqueId，用于区分不同活动物品对应的被推荐装修单号和推荐装修单号的对应关系
			decorationActivityItemPO.setUniqueId(memberOrderVO.getUniqueId());

			decorationActivityItemDao.save(decorationActivityItemPO);
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {

			cppointPO = new CppointPO();

			cppointPO.setCustomer(decorationPO.getCustomer());
			cppointPO.setOrderId(orderId);
			cppointPO.setCompany(decorationPO.getCompany());
		}

		cppointPO.setDpoint(Arith.sub(totald, amount));
		cppointPO.setSpoint(Arith.sub(totals, 0));
		cppointPO.setOpoint(totalo);

		cppointPO.setPoint(Arith.sub(Arith.add(cppointPO.getDpoint(), cppointPO.getSpoint()), Arith.mul(memberOrderVO.getPoint(), 1000000l)));
		cppointDao.saveOrUpdate(cppointPO);

		addCppointPayment(memberOrderVO, cppointPO, decorationActivityPO.getActivity().getMultiple());

		List<CppointPaymentPO> cppointPayments = cppointPaymentDao.queryCppointPaymentByOrderId(memberOrderVO.getOrderId());

		if (cppointPayments == null) {
			throw new FLException(140013, "积分不存在");
		}

		long dpoints = 0;

		long spoints = 0;

		for (CppointPaymentPO payment : cppointPayments) {

			if (CppointPaymentPO.TYPE_DECORATION_INT == payment.getType()) {
				dpoints += payment.getPoint();
			}
			if (CppointPaymentPO.TYPE_MATERIAL_INT == payment.getType()) {
				spoints += payment.getPoint();
			}
		}
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), dpoints, spoints, cppointPO.getOpoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), dpoints, spoints, cppointPO.getOpoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelMemberOrder(MemberOrderVO memberOrderVO, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {
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

		cppointPO.setOpoint(totalo);

		cppointPO.setPoint(Arith.add(cppointPO.getPoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l)));

		cppointDao.saveOrUpdate(cppointPO);

		cancelCppointPayment(memberOrderVO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), cppointPO.getDpoint(), cppointPO.getSpoint(), cppointPO.getOpoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), cppointPO.getDpoint(), cppointPO.getSpoint(), cppointPO.getOpoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMemberGoods(MemberGoodsVO memberGoodsVO) {

		AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberGoodsVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

		if (awardStockPO == null) {

			awardStockPO = new AwardStockPO();

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
			awardStockPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);
			awardStockPO.setFormat(memberGoodsVO.getCategory());

			awardStockDao.save(awardStockPO);
		} else {

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);

			awardStockDao.update(awardStockPO);
		}

		return 0;
	}

	private void addCppointPayment(MemberOrderVO memberOrderVO, CppointPO cppointPO, int multiple) throws FLException {

		long totalPoints = Arith.mul(memberOrderVO.getPoint(), multiple);

		CppointRecordPO cppointRecord = cppointRecordDao.queryCppointRecordByOrderId(memberOrderVO.getOrderId());

		List<CppointPaymentPO> cppointPayments = cppointPaymentDao.queryCppointPaymentByOrderId(memberOrderVO.getOrderId());

		List<BasePaymentVO> allPayments = getAllPaymentsByOrderId(memberOrderVO.getOrderId());

		if (allPayments == null || allPayments.isEmpty()) {
			throw new FLException(130006, "客户支付记录不存在");
		}

		Map<Long, Long> paymentUsedMap = new HashMap<Long, Long>();

		Map<Long, Long> paymentAvailableMap = new HashMap<Long, Long>();

		for (BasePaymentVO basePayment : allPayments) {
			paymentAvailableMap.put(basePayment.getPaymentId(), Arith.mul(basePayment.getReferMoney(), 1l));
		}

		if (cppointPayments != null) {

			for (CppointPaymentPO cppointPayment : cppointPayments) {

				Long paymentId = cppointPayment.getPid();

				long usedPoints = cppointPayment.getPoint();
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

		List<CppointPaymentPO> newRecords = new ArrayList<CppointPaymentPO>();

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

				CppointPaymentPO cppointPayment = new CppointPaymentPO();
				cppointPayment.setCpid(cppointPO.getCpid());
				cppointPayment.setCppointRecord(cppointRecord);
				cppointPayment.setNo(memberOrderVO.getPointOrderId());
				cppointPayment.setOrderId(memberOrderVO.getOrderId());
				cppointPayment.setPid(basePayment.getPaymentId());
				cppointPayment.setType(basePayment.getPaymentType());
				cppointPayment.setPoint(point);
				cppointPayment.setStatus(CppointPaymentPO.STATUS_ABLE_SHORT);
				cppointPayment.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				newRecords.add(cppointPayment);

				totalPoints -= point;
				paymentAvailableMap.put(decorationPaymentId, availablePoints - point);
			}
		}

		for (CppointPaymentPO record : newRecords) {
			cppointPaymentDao.save(record);
		}

	}

	private void cancelCppointPayment(MemberOrderVO memberOrderVO) throws FLException {

		cppointRecordDao.updateCppointRecordByNo(memberOrderVO.getPointOrderId());

		cppointPaymentDao.updateCppointPaymentByNo(memberOrderVO.getPointOrderId());

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
				allPayments.add(new BasePaymentVO(dp.getDpid(), dp.getReferMoney(), dp.getCreateTime(), CppointPaymentPO.TYPE_DECORATION_INT));
			}
		}

		/*
		 * List<Long> salesIds = new ArrayList<Long>(); List<Short> deposiTtypes = Arrays.asList(SalesPaymentPO.TYPE_DEPOSIT_INT, SalesPaymentPO.TYPE_REPLENISHMENT_INT, SalesPaymentPO.STATUS_PAIDFOR_INT);
		 * 
		 * List<SalesPO> salesList = salesDao.querySalesByOrderId(orderId); for(SalesPO sales : salesList){ salesIds.add(sales.getSid()); } // 查询主材支付记录 List<SalesPaymentPO> salesPayments = salesPaymentDao.querySalesPaymentBySids(salesIds, deposiTtypes); if (salesPayments != null) { for (SalesPaymentPO salesPayment : salesPayments) { allPayments.add(new BasePaymentVO(salesPayment.getSpid(), salesPayment.getReferMoney(), salesPayment.getCreateTime(), CppointPaymentPO.TYPE_MATERIAL_INT)); } }
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
	 * 生成 uniqueId（主订单专用）
	 */
	private String generateUniqueId(long doid, String orderId, String parentOrderId) {
		return generateUniqueId(doid, orderId, parentOrderId, null);
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
