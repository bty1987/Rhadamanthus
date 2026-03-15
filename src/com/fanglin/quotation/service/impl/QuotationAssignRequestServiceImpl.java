package com.fanglin.quotation.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.service.BaseService;
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
public class QuotationAssignRequestServiceImpl extends BaseServiceImpl<QuotationAssignRequestPO> implements QuotationAssignRequestService {

	@Autowired
	private QuotationAssignRequestDao quotationAssignRequestDao;

	@Override
	public QuotationAssignRequestDao getDao() {
		return quotationAssignRequestDao;
	}

	@Override
	public List<QuotationAssignRequestVO> pageAssignRequest(Paging paging, List<Filter> filters) {
		List<QuotationAssignRequestPO> poList = quotationAssignRequestDao.page(paging, filters);
		List<QuotationAssignRequestVO> voList = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO po : poList) {
			QuotationAssignRequestVO vo = copyToVO(po);
			voList.add(vo);
		}

		return voList;
	}

	@Override
	public QuotationAssignRequestVO getAssignRequest(Integer barid) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.get(barid);
		if (po == null) {
			return null;
		}
		return copyToVO(po);
	}

	@Override
	public QuotationAssignRequestVO getAssignRequestByOrderId(String orderId) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.findByOrderId(orderId);
		if (po == null) {
			return null;
		}
		return copyToVO(po);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePriority(Integer barid, Byte priority) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.get(barid);
		if (po != null) {
			po.setPriority(priority);
			quotationAssignRequestDao.update(po);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelRequest(Integer barid, String reason) {
		QuotationAssignRequestPO po = quotationAssignRequestDao.get(barid);
		if (po != null) {
			// 更新状态为已取消（这里假设使用 status=4 表示已取消）
			// 如果原PO中没有取消状态，可以删除记录
			po.setStatus((byte) 4); // 假设 4=已取消
			po.setFailReason(reason);
			quotationAssignRequestDao.update(po);
		}
	}

	@Override
	public Map<String, Object> getQueueStatistics(Integer company, Integer department) {
		Map<String, Object> statistics = new HashMap<String, Object>();

		// 查询待分配队列
		List<QuotationAssignRequestPO> pendingList = quotationAssignRequestDao.findPendingQueue(company, department);

		// 总数量
		statistics.put("totalCount", pendingList.size());

		// 各优先级数量
		int highestCount = 0;
		int highCount = 0;
		int normalCount = 0;
		int lowCount = 0;

		// 各类型数量
		int halfPackageCount = 0;  // 半包
		int fullPackageCount = 0;  // 整装

		for (QuotationAssignRequestPO request : pendingList) {
			// 统计优先级
			if (request.getPriority() != null) {
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
			}

			// 统计类型
			if (request.getDecorationType() != null) {
				if (request.getDecorationType() == 1) {
					halfPackageCount++;
				} else if (request.getDecorationType() == 2) {
					fullPackageCount++;
				}
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
		List<QuotationAssignRequestPO> poList = quotationAssignRequestDao.findPendingQueue(company, department);
		List<QuotationAssignRequestVO> voList = new ArrayList<QuotationAssignRequestVO>();

		for (QuotationAssignRequestPO po : poList) {
			QuotationAssignRequestVO vo = copyToVO(po);
			voList.add(vo);
		}

		return voList;
	}

	@Override
	public int getQueuePosition(Integer company, Integer department, Long requestTime) {
		Timestamp timestamp = new Timestamp(requestTime);
		return quotationAssignRequestDao.getQueuePosition(company, timestamp);
	}

	/**
	 * 将 PO 转换为 VO
	 * @param po 持久化对象
	 * @return 值对象
	 */
	private QuotationAssignRequestVO copyToVO(QuotationAssignRequestPO po) {
		QuotationAssignRequestVO vo = new QuotationAssignRequestVO();
		vo.setBarid(po.getBarid());
		vo.setOrderId(po.getOrderId());
		vo.setCompany(po.getCompany());
		vo.setDepartment(po.getDepartment());
		vo.setDecorationType(po.getDecorationType());
		vo.setPriority(po.getPriority());
		vo.setStatus(po.getStatus());
		vo.setRequestTime(po.getRequestTime());
		vo.setAssignTime(po.getAssignTime());
		vo.setFailReason(po.getFailReason());
		vo.setCreateTime(po.getCreateTime());

		// 设置状态名称
		if (po.getStatus() != null) {
			switch (po.getStatus()) {
				case QuotationAssignRequestPO.STATUS_PENDING_INT:
					vo.setStatusName("待分配");
					break;
				case QuotationAssignRequestPO.STATUS_ASSIGNED_INT:
					vo.setStatusName("已分配");
					break;
				case 4:
					vo.setStatusName("已取消");
					break;
				default:
					vo.setStatusName("未知");
					break;
			}
		}

		// 设置优先级名称
		if (po.getPriority() != null) {
			switch (po.getPriority()) {
				case QuotationAssignRequestPO.PRIORITY_HIGHEST_INT:
					vo.setPriorityName("最高");
					break;
				case QuotationAssignRequestPO.PRIORITY_HIGH_INT:
					vo.setPriorityName("高");
					break;
				case QuotationAssignRequestPO.PRIORITY_NORMAL_INT:
					vo.setPriorityName("普通");
					break;
				case QuotationAssignRequestPO.PRIORITY_LOW_INT:
					vo.setPriorityName("低");
					break;
				default:
					vo.setPriorityName("未知");
					break;
			}
		}

		// 设置类型名称
		if (po.getDecorationType() != null) {
			if (po.getDecorationType() == 1) {
				vo.setTypeName("半包");
			} else if (po.getDecorationType() == 2) {
				vo.setTypeName("整装");
			} else {
				vo.setTypeName("未知");
			}
		}

		return vo;
	}
}
