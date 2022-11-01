import teacherBankDetails from "../models/teacherBankDetailsModel.js";
import teacherPayment from "../models/teacherPaymentModel.js";
import Stripe from "stripe";
import teacher from "../models/teacherModel.js";
import moment from "moment-timezone";

const stripe = new Stripe(
  "sk_test_51LsmchG8F3GeBBa1u6sIsApxT2I93AN2wnsg2i4ch6pVlEfZvbg3wXY8WATKNIR8bVtiuUf8rcwJbsItEDucFW4Y00JvOVc6vg"
);

export async function createTeacherBankDetails(req, res, next) {
  try {
    const data = req.body;
    const exist = await teacherBankDetails.find({ accountNumber: data.accountNumber });
    if (exist.length === 0) {
      const teacherbankDetailsData = await teacherBankDetails.create({
        accountName: data.accountName,
        routingNumber: data.routingNumber,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        confirmAccountNumber: data.confirmAccountNumber,
        customerId: data.customerId,
        userId: data.userId,
        teacherId: data.teacherId,
      });
      res.status(201).json({
        message: "Teacher Bank Details Created Successfully",
        data: teacherbankDetailsData,
      });
    } else {
      res.status(400).json({ message: "Account Number is Already Exist" });
    }
  } catch (error) {
    next(error);
  }
}

export async function getTeacherBankDetails(req, res, next) {
  try {
    const data = req.query.userId;
    const bankDetails = await teacherBankDetails.findOne({ userId: data });
    res.status(200).json({
      message: "Get Teacher Bank Details",
      data: bankDetails,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacherBankDetails(req, res, next) {
  try {
    const data = req.body;
    const id = data.id;
    const editData = {
      accountName: data.accountName,
      routingNumber: data.routingNumber,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      confirmAccountNumber: data.confirmAccountNumber,
      customerId: data.customerId,
    };
    const editTeacherBankDetails = await teacherBankDetails.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      state: "Success",
      message: "Bank Details Updated Successfully",
      data: editTeacherBankDetails,
    });
  } catch (error) {
    next(error);
  }
}

export async function createStripeCustomer(req, res, next) {
  try {
    const data = req.body;

    const userData = await teacher.findOne({ _id: data.teacherId });

    const exist = await teacherBankDetails.find({ accountNumber: data.accountNumber });

    if (exist.length === 0) {
      const teacherbankDetailsData = await teacherBankDetails.create({
        accountName: data.accountHolderName,
        routingNumber: data.routingNumber,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        confirmAccountNumber: data.confirmAccountNumber,
        userId: data.userId,
        teacherId: data.teacherId,
      });
      //create customer in stripe
      const createAccount = await stripe.customers.create(
        {
          name: userData.firstName + "" + userData.lastName,
          email: userData.email,
        },
        async function (err, createSuccessMsg) {
          if (err) {
            console.log("Error:", err);
          } else {
            //update teacher customer id
            const customerId = createSuccessMsg.id;
            const editData = {
              customerId: customerId,
            };

            const updateCutomerId = await teacher.findByIdAndUpdate(data.teacherId, editData, {
              new: true,
              runValidators: true,
            });

            // Create Customer Bank Account
            const createToeknData = await stripe.tokens.create(
              {
                bank_account: {
                  country: data.country,
                  currency: data.currency,
                  account_number: data.accountNumber,
                  routing_number: data.routingNumber,
                  account_holder_name: data.accountHolderName,
                  account_holder_type: data.accountType,
                },
              },
              async function (err, createBanksuccessMsg) {
                if (err) {
                  console.log("Error:", err);
                } else {
                  const bankId = createBanksuccessMsg.id;
                  const bankAccount = await stripe.customers.createSource(
                    customerId,
                    {
                      source: bankId,
                    },
                    async function (err, linkWithCustomersuccess) {
                      if (err) {
                        console.log("Error:", err);
                      } else {
                        const sourceId = linkWithCustomersuccess.id;
                        const customer = linkWithCustomersuccess.customer;
                        const bankAccount = await stripe.customers.verifySource(
                          customer,
                          sourceId,
                          { amounts: [32, 45] },
                          async function (err, success) {
                            if (err) {
                              console.log("Error: ", err);
                            } else {
                              console.log("Account verified.", success);
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
      res.status(201).json({
        message: "Teacher Bank Details Created Successfully",
        data: teacherbankDetailsData,
      });
    } else {
      res.status(400).json({ message: "Account Number is Already Exist" });
    }
  } catch (error) {
    next(error);
  }
}
export async function chargeStripeCustomer(req, res, next) {
  try {
    const data = req.body;
    console.log("data...", data);
    const charges = await stripe.charges.create(
      {
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        customer: data.customer,
      },
      async function (err, success) {
        if (err) {
          console.log("Error: ", err);
        } else {
          // update teacher paymnent history
          const teacherPaymentId = await teacherPayment.findOne({ _id: data.updatePaymentId });

          const payDate = moment(data.paymentDate).format("ll");
          const timeStamp = moment(payDate).format("LLLL");
          const editData = {
            payment: data.payment,
            paymentDate: payDate,
            paymentTime: timeStamp,
          };

          const updatePayment = await teacherPayment.findByIdAndUpdate(teacherPaymentId._id, editData, {
            new: true,
            runValidators: true,
          });

          res.status(201).json({
            message: "Teacher Payment Updated Succesfully",
            updatePayment,
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
}
