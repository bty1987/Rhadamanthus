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
import com.fanglin.log.dao.DecorationPictureLogDao;
import com.fanglin.log.po.DecorationPictureLogPO;
import com.fanglin.log.service.DecorationPictureLogService;
import com.fanglin.log.vo.DecorationPictureLogVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.UUIDUtil;

@Service("decorationPictureLogService")
@Transactional(readOnly = true)
public class DecorationPictureLogServiceImpl implements DecorationPictureLogService {

	@Autowired
	private DecorationPictureLogDao decorationPictureLogDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationPictureDao decorationPictureDao;

	@Override
	public void pageDecorationPictureLog(Paging paging, List<Filter> filters){
		List<DecorationPictureLogPO> pos = decorationPictureLogDao.pageDecorationPictureLog(paging, filters);
		List<DecorationPictureLogVO> vos = new ArrayList<DecorationPictureLogVO>();

		List<String> userIds = collectUserIds(pos);
		Map<String, String> userNameMap = queryUserNameMap(userIds);

		for (DecorationPictureLogPO po : pos){
			DecorationPictureLogVO vo = new DecorationPictureLogVO();
			BeanUtil.copyProperties(po, vo);
			vo.setOperateUserName(userNameMap.get(po.getOperateUserId()));
			vos.add(vo);
		}

		paging.setData(vos);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationPictureLog(long dpId, String orderId, String userId){
		DecorationPictureLogPO po = new DecorationPictureLogPO();
		po.setDpId(dpId);
		po.setOrderId(orderId);
		po.setOperateUserId(userId);
		po.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		po.setTraceId(UUIDUtil.getUuid());

		decorationPictureLogDao.save(po);
		return 0;
	}

	private List<String> collectUserIds(List<DecorationPictureLogPO> pos){
		List<String> userIds = new ArrayList<String>();
		if (pos == null) return userIds;
		for (DecorationPictureLogPO po : pos){
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
