package com.fanglin.log.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.KingdeeSyncLogDao;
import com.fanglin.log.po.KingdeeSyncLogPO;
import com.fanglin.log.service.KingdeeSyncLogService;
import com.fanglin.log.vo.KingdeeSyncLogVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.UUIDUtil;

@Service("kingdeeSyncLogService")
@Transactional(readOnly = true)
public class KingdeeSyncLogServiceImpl implements KingdeeSyncLogService {

	@Autowired
	private KingdeeSyncLogDao kingdeeSyncLogDao;

	@Override
	public void pageKingdeeSyncLog(Paging paging, List<Filter> filters) {
		List<KingdeeSyncLogPO> pos = kingdeeSyncLogDao.pageKingdeeSyncLog(paging, filters);
		List<KingdeeSyncLogVO> vos = new ArrayList<KingdeeSyncLogVO>();

		for (KingdeeSyncLogPO po : pos) {
			KingdeeSyncLogVO vo = new KingdeeSyncLogVO();
			BeanUtil.copyProperties(po, vo);
			// operateUserName 不在原表里，这里不强制填充（前端按 userId 展示）
			vos.add(vo);
		}

		paging.setData(vos);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addKingdeeSyncLog(String orderId, long rtid, short atttype, String type, String message, String userId) {
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

}
