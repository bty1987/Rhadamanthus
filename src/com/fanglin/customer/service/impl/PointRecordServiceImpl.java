package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PointRecordDao;
import com.fanglin.customer.po.PointRecordPO;
import com.fanglin.customer.service.PointRecordService;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.customer.vo.PointRecordVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Paging;

@Service("pointRecordService")
@Transactional(readOnly = true)
public class PointRecordServiceImpl implements PointRecordService {

	@Autowired
	private PointRecordDao pointRecordDao;

	public void queryPointRecord(PointAccountVO pointAccountVO, Paging paging, List<Filter> filters) {

		List<PointRecordPO> pointRecordPOs = pointRecordDao.queryPointRecord(pointAccountVO.getAccountId(), paging, filters);
		List<PointRecordVO> pointRecordVOs = new ArrayList<PointRecordVO>();

		for (PointRecordPO pointRecordPO : pointRecordPOs) {
			pointRecordVOs.add(pointRecordPO.ptv(new PointRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()))));
		}

		paging.setData(pointRecordVOs);
	}

}
