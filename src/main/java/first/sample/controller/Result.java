/**
 * Copyright (c) 2017 VertexID RND, Inc.
 * All right reserved.
 *
 * This software is the confidential and proprietary information of VertexID, Inc.
 * You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with VertexID.
 *
 * Revision History
 * Author              		Date       		Description
 * ------------------   --------------    ------------------
 * "Kim Jin Ho"         	2017. 3. 24. 			First Draft.
 */
package first.sample.controller;

/**
 * [설명]
 *
 * @class Result.java
 * @package vertexid.paragon.comm.util
 * @author "Kim Jin Ho"
 * @version 1.0
 */
public class Result {
	private boolean success;
	private String message;

	public Result() {
		this.success = true;
		this.message = null;
	}

	public Result(boolean success, String message) {
		this.success = success;
		this.message = message;
	}

	public boolean isSuccess() {
		return this.success;
	}

	public void setSuccess() {
		this.success = true;
	}

	public void setSuccess(String message) {
		this.success = true;
		this.message = message;
	}

	public void setFail() {
		this.success = false;
	}

	public void setFail(String message) {
		this.success = false;
		this.message = message;
	}

	public String getMessage() {
		return this.message;
	}
}