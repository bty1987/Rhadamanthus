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
import com.fanglin.log.dao.KingdeeSyncLogDao;
import com.fanglin.log.po.KingdeeSyncLogPO;
import com.fanglin.log.service.KingdeeSyncLogService;
import com.fanglin.log.vo.KingdeeSyncLogVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.UUIDUtil;

@Service("kingdeeSyncLogService")
@Transactional(readOnly = true)
public class KingdeeSyncLogServiceImpl implements KingdeeSyncLogService {

	@Autowired
	private KingdeeSyncLogDao kingdeeSyncLogDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageKingdeeSyncLog(Paging paging, List<Filter> filters){
		List<KingdeeSyncLogPO> pos = kingdeeSyncLogDao.pageKingdeeSyncLog(paging, filters);
		List<KingdeeSyncLogVO> vos = new ArrayList<KingdeeSyncLogVO>();

		List<String> userIds = collectUserIds(pos);
		Map<String, String> userNameMap = queryUserNameMap(userIds);

		for (KingdeeSyncLogPO po : pos){
			KingdeeSyncLogVO vo = new KingdeeSyncLogVO();
			BeanUtil.copyProperties(po, vo);
			// operateUserName 不在原表里，这里不强制填充（前端按 userId 展示）
			vos.add(vo);
		}

		paging.setData(vos);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addKingdeeSyncLog(String orderId, long rtid, short atttype, String type, String message, String userId){
		KingdeeSyncLogPO po = new KingdeeSyncLogPO();
		po.setOrderId(orderId);
		po.setRtid(rtid);
		po.setAtttype(atttype);
		po.setType(type);
		po.setMessage(message);
		po.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		po.setOperateUserId(userId);
		po.setTraceId(UUIDUtil.getUuid());

		kingdeeSyncLogDao.save(po);
		return 0;
	}

	private List<String> collectUserIds(List<KingdeeSyncLogPO> pos){
		List<String> userIds = new ArrayList<String>();
		if (pos == null) return userIds;
		for (KingdeeSyncLogPO po : pos){
			if (po.getOperateUserId() != null && !userIds.contains(po.getOperateUserId())){
				userIds.add(po.getOperateUserId());
			}
		}
		return userIds;
	}

	private Map<String, String> queryUserNameMap(List<String> userIds){
		Map<String, String> map = new HashMap<String, String>();
		if (userIds == null || userIds.isEmpty()) return map;
		try {
			List<UserPO> users = userDao.queryUserByUserIds(userIds);
			if (users != null){
				for (UserPO user : users){
					map.put(user.getUserId(), user.getCurrentName());
				}
			}
		} catch (Throwable ignore) { }
		return map;
	}

}
