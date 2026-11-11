/**
 * @File Name		: DecorationBelongDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.vo.DecorationBelongTranUserVO;
import com.fanglin.decoration.vo.DecorationBelongTranVO;
import com.fanglin.utils.Paging;

@Repository("decorationBelongDao")
public class DecorationBelongDaoImpl extends DaoImpl<DecorationBelongPO> implements DecorationBelongDao {

	public DecorationBelongDaoImpl() {
		super(DecorationBelongPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelong(String orderId, Short type, Short status) {

		Criteria query = createCriteria(DecorationBelongPO.class).add(Restrictions.eq("orderId", orderId));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelongByOrderIds(List<String> orderIds) {
		return session().createCriteria(DecorationBelongPO.class).add(Restrictions.in("orderId", orderIds)).add(Restrictions.ne("status", DecorationBelongPO.STATUS_EFFCTIVE_INT)).list();
	}

	@Override
	public int countDecorationBelong(String orderId, short type, short status) {

		String sql = "select count(*) from decoration.decorationbelong where orderId = :orderId and type = :type and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).setShort("status", status).uniqueResult();

		return count.intValue();
	}

	@Override
	public int changeDecorationBelongForOrderId(String source, String target) {

		String sql = "update decoration.decorationbelong set orderId=:source where orderId=:target";
		session().createSQLQuery(sql).setString("source", source).setString("target", target).executeUpdate();

		return 0;
	}

	@Override
	public int updateDecorationBelong(String orderId, Short type, Short source, Short target) {

		String sql = "update decoration.decorationbelong set status = :target where orderId=:orderId and status = :source and type = :type";
		session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).setShort("source", source).setShort("target", target).executeUpdate();

		return 0;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongTranUserVO> queryDecorationBelongForTran(String keyword, int company) {

		// 离职移交候选: 按归属人生效单聚合(可移交状态0-4), 按归属表取人天然含离职者, 不走人员搜索接口的在职缺省过滤
		StringBuffer hql = new StringBuffer("select b.belonger.uid, b.belonger.userId, b.belonger.currentName, b.belonger.dept.name, sum(case when b.type = 0 then 1 else 0 end), sum(case when b.type = 1 then 1 else 0 end)");
		hql.append(" from DecorationBelongPO b, DecorationPO d where b.orderId = d.orderId and b.status = 0 and d.status in (0, 1, 2, 3, 4) and d.company = :company");

		if (keyword != null && keyword.trim().length() != 0) {
			hql.append(" and (b.belonger.currentName like :keyword or b.belonger.pinYin like :keyword or b.belonger.userId like :keyword)");
		}

		hql.append(" group by b.belonger.uid, b.belonger.userId, b.belonger.currentName, b.belonger.dept.name order by b.belonger.uid desc");

		org.hibernate.Query query = session().createQuery(hql.toString()).setParameter("company", company);

		if (keyword != null && keyword.trim().length() != 0) query.setParameter("keyword", "%" + keyword.trim() + "%");

		query.setMaxResults(200);

		List<DecorationBelongTranUserVO> vos = new ArrayList<DecorationBelongTranUserVO>();

		for (Object[] row : (List<Object[]>) query.list()) {

			DecorationBelongTranUserVO vo = new DecorationBelongTranUserVO();

			vo.setUid(Integer.valueOf(((Number) row[0]).intValue()));
			vo.setUserId((String) row[1]);
			vo.setUserName((String) row[2]);
			vo.setDeptName((String) row[3]);
			vo.setDesignCount(Integer.valueOf(row[4] != null ? ((Number) row[4]).intValue() : 0));
			vo.setSalesCount(Integer.valueOf(row[5] != null ? ((Number) row[5]).intValue() : 0));

			vos.add(vo);
		}

		return vos;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongTranVO> pageDecorationForTranByBelonger(Paging paging, int buid, short belongType, int company) {

		// 原移交人名下可移交单(按归属表生效行口径, 覆盖合尺非默认场景; 在途审批不做列标记, 由提交端240089精确拒)
		String where = " where b.orderId = d.orderId and d.customer = cu and b.status = 0 and b.belonger.uid = :buid and b.type = :type and d.company = :company and d.status in (0, 1, 2, 3, 4)";

		String countHql = "select count(distinct b.orderId) from DecorationBelongPO b, DecorationPO d, CustomerPO cu" + where;
		String listHql = "select b.orderId, cu.name, d.status, max(b.rate), max(b.defaultFlag) from DecorationBelongPO b, DecorationPO d, CustomerPO cu" + where + " group by b.orderId, cu.name, d.status order by b.orderId desc";

		int totalRecords = ((Number) session().createQuery(countHql).setParameter("buid", buid).setParameter("type", belongType).setParameter("company", company).uniqueResult()).intValue();

		paging.setTotalRecords(Integer.valueOf(totalRecords));
		paging.setTotalPage(Integer.valueOf((totalRecords + paging.getRows().intValue() - 1) / paging.getRows().intValue()));

		List<DecorationBelongTranVO> vos = new ArrayList<DecorationBelongTranVO>();

		if (totalRecords == 0) return vos;

		List<Object[]> rows = session().createQuery(listHql).setParameter("buid", buid).setParameter("type", belongType).setParameter("company", company).setFirstResult(paging.getPage().intValue() * paging.getRows().intValue()).setMaxResults(paging.getRows().intValue()).list();

		for (Object[] row : rows) {

			DecorationBelongTranVO vo = new DecorationBelongTranVO();

			vo.setOrderId((String) row[0]);
			vo.setCustomerName((String) row[1]);
			vo.setStatus(Short.valueOf(((Number) row[2]).shortValue()));
			vo.setRate(Integer.valueOf(row[3] != null ? ((Number) row[3]).intValue() : 0));
			vo.setDefaultFlag(Short.valueOf(row[4] != null ? ((Number) row[4]).shortValue() : 0));

			vos.add(vo);
		}

		return vos;
	}

}
