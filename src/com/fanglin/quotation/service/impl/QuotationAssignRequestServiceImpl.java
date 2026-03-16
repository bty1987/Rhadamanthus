package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRequestDao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.quotation.service.QuotationAssignRequestService;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.Paging;

/**
 * 待分配请求服务实现类
 */
@Service
public class QuotationAssignRequestServiceImpl implements QuotationAssignRequestService {

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Override
	public List<QuotationAssignRequestVO> pageAssignRequest(Paging paging, List<Filter> filters) {
		List<QuotationAssignRequestPO> poList = quotationAssignRequestDao.page(paging, filters);
		List<QuotationAssignRequestVO> voList = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO po : poList) {
			voList.add(po.ptv(new QuotationAssignRequestVO()));
		}

		paging.setData(voList);

		return voList;
	}

	@Override
	public QuotationAssignRequestVO getAssignRequest(Integer qarid) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.get(qarid);
		return po != null ? po.ptv(new QuotationAssignRequestVO()) : null;
	}

	@Override
	public QuotationAssignRequestVO getAssignRequestByOrderId(String orderId) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.queryQuotationAssignRequestByOrderId(orderId);
		return po != null ? po.ptv(new QuotationAssignRequestVO()) : null;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePriority(Integer qarid, Byte priority) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.get(qarid);
		if (po != null) {
			po.setPriority(priority);
			quotationAssignRequestDao.update(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelRequest(Integer qarid, String reason) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.get(qarid);
		if (po != null) {
			// 删除待分配请求
			quotationAssignRequestDao.deleteQuotationAssignRequestByOrderIdAndStatus(po.getOrderId(), QuotationAssignRequestPO.STATUS_PENDING_INT);
		}
	}

	@Override
	public Map<String, Object> getQueueStatistics(Integer company, Integer department) {
		Map<String, Object> statistics = new HashMap<String, Object>();

		// 查询待分配队列
		List<QuotationAssignRequestPO> pendingList = quotationAssignRequestDao.queryPendingQuotationAssignRequestQueue(company, department);

		// 总数量
		statistics.put("totalCount", pendingList.size());

		// 各优先级数量
		int highestCount = 0;
		int highCount = 0;
		int normalCount = 0;
		int lowCount = 0;

		// 各类型数量
		int halfPackageCount = 0; // 半包
		int fullPackageCount = 0; // 整装

		for (QuotationAssignRequestPO request : pendingList) {
			// 统计优先级
			switch (request.getPriority()) {
				case QuotationAssignRequestPO.PRIORITY_HIGHEST_INT:
					highestCount++;
					break;
				case QuotationAssignRequestPO.PRIORITY_HIGH_INT:
					highCount++;
					break;
				case QuotationAssignRequestPO.PRIORITY_NORMAL_INT:
					normalCount++;
					break;
				case QuotationAssignRequestPO.PRIORITY_LOW_INT:
					lowCount++;
					break;
			}

			// 统计类型
			if (request.getDecorationType() == 1) {
				halfPackageCount++;
			} else if (request.getDecorationType() == 2) {
				fullPackageCount++;
			}
		}

		// 优先级统计
		Map<String, Integer> priorityStats = new HashMap<String, Integer>();
		priorityStats.put("highest", highestCount);
		priorityStats.put("high", highCount);
		priorityStats.put("normal", normalCount);
		priorityStats.put("low", lowCount);
		statistics.put("priorityStatistics", priorityStats);

		// 类型统计
		Map<String, Integer> typeStats = new HashMap<String, Integer>();
		typeStats.put("halfPackage", halfPackageCount);
		typeStats.put("fullPackage", fullPackageCount);
		statistics.put("typeStatistics", typeStats);

		return statistics;
	}

	@Override
	public List<QuotationAssignRequestVO> getPendingQueue(Integer company, Integer department) {
		List<QuotationAssignRequestPO> poList = quotationAssignRequestDao.queryPendingQuotationAssignRequestQueue(company, department);
		List<QuotationAssignRequestVO> voList = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO po : poList) {
			voList.add(po.ptv(new QuotationAssignRequestVO()));
		}

		return voList;
	}

	@Override
	public int getQueuePosition(Integer company, Integer department, Long requestTime) {
		Timestamp timestamp = new Timestamp(requestTime);
		return quotationAssignRequestDao.getQuotationAssignRequestQueuePosition(company, timestamp);
	}
}
