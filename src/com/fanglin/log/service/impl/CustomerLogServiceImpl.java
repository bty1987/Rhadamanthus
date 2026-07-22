/**
 * @File Name		: CustomerLogServiceImpl.java
 * @Package 		: com.fanglin.log.service.impl
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Describing		: 客户电话查询日志 Service 实现
 *
 *  说明：
 *    - 写入：接收业务参数，构造 PO，save
 *    - 查询：PO → VO，批量 join 用户名（避免 N+1），按需 join 客户名/电话
 */

package com.fanglin.log.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.CustomerLogDao;
import com.fanglin.log.po.CustomerLogPO;
import com.fanglin.log.service.CustomerLogService;
import com.fanglin.log.vo.CustomerLogVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.UUIDUtil;

@Service("customerLogService")
@Transactional(readOnly = true)
public class CustomerLogServiceImpl implements CustomerLogService {

	@Autowired
	private CustomerLogDao customerLogDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageCustomerLog(Paging paging, List<Filter> filters) {
		List<CustomerLogPO> pos = customerLogDao.pageCustomerLog(paging, filters);
		List<CustomerLogVO> vos = new ArrayList<CustomerLogVO>();

		// 批量查用户名，避免 N+1
		List<String> userIds = collectUserIds(pos);
		Map<String, String> userNameMap = queryUserNameMap(userIds);

		for (CustomerLogPO po : pos) {
			CustomerLogVO vo = new CustomerLogVO();
			BeanUtil.copyProperties(po, vo);
			vo.setOperateUserName(userNameMap.get(po.getOperateUserId()));
			vos.add(vo);
		}

		paging.setData(vos);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerLog(long cid, long cpid, String userId, String comment) {
		CustomerLogPO po = new CustomerLogPO();
		po.setCid(cid);
		po.setCpid(cpid);
		po.setType(CustomerLogPO.TYPE_QUERY_INT);
		po.setOperateUserId(userId);
		po.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		po.setComment(comment);
		po.setTraceId(UUIDUtil.getUuid());

		customerLogDao.save(po);
		return 0;
	}

	// ===== 私有辅助方法 =====

	private List<String> collectUserIds(List<CustomerLogPO> pos) {
		List<String> userIds = new ArrayList<String>();
		if (pos == null) return userIds;
		for (CustomerLogPO po : pos) {
			if (po.getOperateUserId() != null && !userIds.contains(po.getOperateUserId())) {
				userIds.add(po.getOperateUserId());
			}
		}
		return userIds;
	}

	private Map<String, String> queryUserNameMap(List<String> userIds) {
		Map<String, String> map = new HashMap<String, String>();
		if (userIds == null || userIds.isEmpty()) return map;
		try {
			List<UserPO> users = userDao.queryUserByUserIds(userIds);
			if (users != null) {
				for (UserPO user : users) {
					map.put(user.getUserId(), user.getCurrentName());
				}
			}
		} catch (Throwable ignore) {
		}
		return map;
	}

}
