package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;

@Repository("quotetionFunctionAreaItemDao")
public class QuotetionFunctionAreaItemDaoImpl extends DaoImpl<QuotetionFunctionAreaItemPO> implements QuotetionFunctionAreaItemDao {

	public QuotetionFunctionAreaItemDaoImpl() {
		super(QuotetionFunctionAreaItemPO.class);
	}

	@Override
	public QuotetionFunctionAreaItemPO queryQuotetionFunctionAreaItemByQfaiId(Class<?> clazz, long qfaiId) {
		return (QuotetionFunctionAreaItemPO) session().createCriteria(clazz).add(Restrictions.eq("qfaiId", qfaiId)).setMaxResults(1).uniqueResult();
	}

	@Override
	public QuotetionFunctionAreaItemPO queryQuotetionFunctionAreaItem(Class<?> clazz, long quotetionFunctionAreaId, short type) {
		return (QuotetionFunctionAreaItemPO) session().createCriteria(clazz).add(Restrictions.eq("qfaid", quotetionFunctionAreaId)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotetionFunctionAreaItemPO> queryQuotetionFunctionAreaItemByFunctionAreaId(Class<?> clazz, long qfaid) {
		return session().createCriteria(clazz).add(Restrictions.eq("qfaid", qfaid)).list();
	}

	@Override
	public int updateQuotetionFunctionAreaItemForIndex(String table, QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO) throws FLException {

		String sql = String.format("update quotetion.%s  set `index` = :index where qfaiId = :qfaiId", table);
		session().createSQLQuery(sql).setInteger("index", quotetionFunctionAreaItemVO.getIndex()).setLong("qfaiId", quotetionFunctionAreaItemVO.getQfaiId()).executeUpdate();

		return 0;
	}

	@Override
	public int deleteQuotetionFunctionAreaItemByQfaiIds(String table, List<Long> qfaiIds) {

		String sql = String.format("delete %s q where q.qfaiId in :qfaiIds", table);
		int deletedEntities = session().createQuery(sql).setParameterList("qfaiIds", qfaiIds).executeUpdate();

		return deletedEntities;
	}

	@Override
	public int deleteQuotetionFunctionAreaItemByFunctionAreaId(String table, long qfaid) {

		String sql = String.format("delete %s  q where q.qfaid = :qfaid", table);
		int deletedEntities = session().createQuery(sql).setLong("qfaid", qfaid).executeUpdate();

		return deletedEntities;
	}

	@Override
	public int copyQuotetionFunctionAreaItem(String table, long sqfaid, long tqfaid) {

		String sql = String.format("INSERT INTO quotetion.%s (qfaid, qiid, name, addPrice, unitPrice, subPrice, `index`, formula, num, type, subtype, measurementUnit, workType, discount, content) SELECT :tqfaid, qiid, name, addPrice, unitPrice, subPrice, `index`, formula, num, type, subtype, measurementUnit, workType, discount, content FROM quotetion.%s WHERE qfaid = :sqfaid", table, table);

		return session().createSQLQuery(sql).setLong("tqfaid", tqfaid).setLong("sqfaid", sqfaid).executeUpdate();
	}

}
