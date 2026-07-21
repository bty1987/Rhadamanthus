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
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.log.dao.DecorationLogDao;
import com.fanglin.log.po.DecorationLogPO;
import com.fanglin.log.service.DecorationLogService;
import com.fanglin.log.vo.DecorationLogVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.UUIDUtil;

@Service("decorationLogService")
@Transactional(readOnly = true)
public class DecorationLogServiceImpl implements DecorationLogService {

	@Autowired
	private DecorationLogDao decorationLogDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationPictureDao decorationPictureDao;

	@Override
	public void pageDecorationLog(Paging paging, List<Filter> filters){
		List<DecorationLogPO> pos = decorationLogDao.pageDecorationLog(paging, filters);
		List<DecorationLogVO> vos = new ArrayList<DecorationLogVO>();

		List<String> userIds = collectUserIds(pos);
		Map<String, String> userNameMap = queryUserNameMap(userIds);

		for (DecorationLogPO po : pos){
			DecorationLogVO vo = new DecorationLogVO();
			BeanUtil.copyProperties(po, vo);
			vo.setOperateUserName(userNameMap.get(po.getOperateUserId()));
			vos.add(vo);
		}

		paging.setData(vos);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationLog(long dpId, String orderId, String userId){
		DecorationLogPO po = new DecorationLogPO();
		po.setDpId(dpId);
		po.setOrderId(orderId);
		po.setOperateUserId(userId);
		po.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		po.setTraceId(UUIDUtil.getUuid());

		decorationLogDao.save(po);
		return 0;
	}

	private List<String> collectUserIds(List<DecorationLogPO> pos){
		List<String> userIds = new ArrayList<String>();
		if (pos == null) return userIds;
		for (DecorationLogPO po : pos){
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
