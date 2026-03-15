package com.fanglin.customer.dao.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CustomerUserRuleItemDao;
import com.fanglin.customer.po.CustomerUserRuleItemPO;
import com.fanglin.customer.po.CustomerUserRulePO;

@Repository("customerUserRuleItemDao")
public class CustomerUserRuleItemDaoImpl extends DaoImpl<CustomerUserRuleItemPO> implements CustomerUserRuleItemDao {

	public CustomerUserRuleItemDaoImpl() {
		super(CustomerUserRuleItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerUserRuleItemPO> queryCustomerUserRuleItem(Long curid) {

		return session().createCriteria(CustomerUserRuleItemPO.class).add(Restrictions.eq("curid", curid)).list();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company) {
		return (CustomerUserRuleItemPO) session().createCriteria(CustomerUserRulePO.class).add(Restrictions.ge("surplus", 1000)).add(Restrictions.eq("company", company)).addOrder(Order.desc("surplus")).add(Restrictions.eq("status", CustomerUserRulePO.STATUS_ENABLE_INT)).setMaxResults(1).uniqueResult();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, int dtid) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		String sql = "select curi.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status = 0 and curi.status = 0 and ((curi.type = 0 and curi.uppval < :uppval and curi.lowval >= :lowval) or (curi.type = 1) or (curi.type = 2 and curi.did = :did and curi.uppval < :uppval1 and curi.lowval >= :lowval1) or (curi.type = 3 and curi.dtid = :dtid and curi.uppval < :uppval2 and curi.lowval >= :lowval2)) and TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, curi.handletime, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRuleItemPO.class);

		query.setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).setInteger("did", did).setInteger("uppval1", area).setInteger("lowval1", area).setInteger("dtid", dtid).setInteger("uppval2", area).setInteger("lowval2", area).setParameterList("uids", uids);

		return (CustomerUserRuleItemPO) query.uniqueResult();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		String sql = "select curi.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status = 0 and curi.status = 0 and ((curi.type = 0 and curi.uppval < :uppval and curi.lowval >= :lowval) OR (curi.type = 1)) AND TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, curi.handletime, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRuleItemPO.class);

		query.setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).setParameterList("uids", uids);

		return (CustomerUserRuleItemPO) query.uniqueResult();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, int dtid, List<Integer> uids) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		String sql = "select curi.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status = 0 and curi.status = 0 and ((curi.type = 1) or (curi.type = 3 and curi.dtid = :dtid and curi.uppval < :uppval1 and curi.lowval >= :lowval1)) and TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, curi.handletime, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRuleItemPO.class);

		query.setInteger("company", company).setInteger("dtid", dtid).setInteger("uppval1", area).setInteger("lowval1", area).setParameterList("uids", uids);

		return (CustomerUserRuleItemPO) query.uniqueResult();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		String sql = "select curi.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status = 0 and curi.status = 0 and ((curi.type = 1) or (curi.type = 2 and curi.did = :did and curi.uppval < :uppval1 and curi.lowval >= :lowval1)) and TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, curi.handletime, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRuleItemPO.class);

		query.setInteger("company", company).setInteger("did", did).setInteger("uppval1", area).setInteger("lowval1", area).setParameterList("uids", uids);

		return (CustomerUserRuleItemPO) query.uniqueResult();
	}

	@Override
	public int existCustomerUserRuleItem(int company, int area) {

		String sql = "select count(*) from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status != 4 and curi.uppval < :uppval and curi.lowval >= :lowval";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setInteger("uppval", area).setInteger("lowval", area).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, Integer cpid) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		// 城区规则支持：type = 4 and curi.cpid = :cpid
		String sql = "select curi.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status = 0 and curi.status = 0 and ((curi.type = 0 and curi.uppval < :uppval and curi.lowval >= :lowval) or (curi.type = 1) or (curi.type = 2 and curi.did = :did and curi.uppval < :uppval1 and curi.lowval >= :lowval1) or (curi.type = 4 and curi.cpid = :cpid)) and TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, curi.handletime, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRuleItemPO.class);

		query.setInteger("company", company)
		      .setInteger("uppval", area).setInteger("lowval", area)
		      .setInteger("did", did).setInteger("uppval1", area).setInteger("lowval1", area)
		      .setInteger("cpid", cpid != null ? cpid : 0) // 城区参数
		      .setParameterList("uids", uids);

		return (CustomerUserRuleItemPO) query.uniqueResult();
	}

	@Override
	public CustomerUserRuleItemPO pullCustomerUserRuleItem(int company, int area, List<Integer> uids, int did, int dtid, Integer cpid) {

		if (uids == null) uids = new ArrayList<Integer>();

		uids.add(0);

		// 城区规则支持：type = 4 and curi.cpid = :cpid
		String sql = "select curi.* from customer.customeruserrule cur, customer.customeruserruleitem curi where cur.curid = curi.curid and cur.company = :company and cur.status = 0 and curi.status = 0 and ((curi.type = 0 and curi.uppval < :uppval and curi.lowval >= :lowval) or (curi.type = 1) or (curi.type = 2 and curi.did = :did and curi.uppval < :uppval1 and curi.lowval >= :lowval1) or (curi.type = 3 and curi.dtid = :dtid and curi.uppval < :uppval2 and curi.lowval >= :lowval2) or (curi.type = 4 and curi.cpid = :cpid)) and TIMEDIFF(now(), cur.updateTime) > '00:05:00' AND cur.uid NOT IN :uids order by curi.priority desc, curi.handletime, cur.surplus desc limit 1";

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(CustomerUserRuleItemPO.class);

		query.setInteger("company", company)
		      .setInteger("uppval", area).setInteger("lowval", area)
		      .setInteger("did", did).setInteger("uppval1", area).setInteger("lowval1", area)
		      .setInteger("dtid", dtid).setInteger("uppval2", area).setInteger("lowval2", area)
		      .setInteger("cpid", cpid != null ? cpid : 0) // 城区参数
		      .setParameterList("uids", uids);

		return (CustomerUserRuleItemPO) query.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Object[]> queryCustomerUserRuleItemByPinyin(String pinyinName) {
		// 通过 JOIN 查询：customeruserruleitem -> customeruserrule -> user
		// 使用 addEntity 让 Hibernate 自动映射到实体类
		String sql = "SELECT {curi.*}, {u.*} " +
			     "FROM customer.customeruserruleitem curi " +
			     "INNER JOIN customer.customeruserrule cur ON curi.curid = cur.curid " +
			     "INNER JOIN communion.user u ON cur.uid = u.uid " +
			     "WHERE u.pinyin LIKE :pinyinName " +
			     "AND curi.status = 0 " +
			     "AND cur.status != 4 " +
			     "ORDER BY curi.priority DESC, curi.createTime";

		SQLQuery query = session().createSQLQuery(sql);
		query.setString("pinyinName", pinyinName + "%");
		query.addEntity("curi", CustomerUserRuleItemPO.class);
		query.addEntity("u", com.fanglin.personel.po.UserPO.class);

		return query.list();
	}

}
